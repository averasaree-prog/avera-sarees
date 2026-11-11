package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.AddressDto;
import com.saanvi.sarees.dto.CheckoutDto;
import com.saanvi.sarees.dto.OrderDto;
import com.saanvi.sarees.dto.PaymentDto;
import com.saanvi.sarees.entity.*;
import com.saanvi.sarees.enums.OrderStatus;
import com.saanvi.sarees.enums.PaymentMethod;
import com.saanvi.sarees.enums.PaymentStatus;
import com.saanvi.sarees.exception.BadRequestException;
import com.saanvi.sarees.exception.InsufficientStockException;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final CouponRepository couponRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final CartService cartService;
    private final AuthService authService;
    private final CouponService couponService;
    private final PaymentService paymentService;

    @Value("${app.shipping.free-shipping-threshold:2999.00}")
    private BigDecimal freeShippingThreshold;

    @Value("${app.shipping.standard-shipping-rate:150.00}")
    private BigDecimal standardShippingRate;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        AddressRepository addressRepository,
                        CouponRepository couponRepository,
                        OrderStatusHistoryRepository orderStatusHistoryRepository,
                        CartService cartService,
                        AuthService authService,
                        CouponService couponService,
                        PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.couponRepository = couponRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.cartService = cartService;
        this.authService = authService;
        this.couponService = couponService;
        this.paymentService = paymentService;
    }

    public CheckoutDto.CheckoutSummaryResponse calculateCheckoutSummary(String sessionToken, CheckoutDto.CheckoutSummaryRequest request) {
        Cart cart = cartService.getOrCreateCart(sessionToken);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your shopping bag is empty. Please add items before checking out.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        // Revalidate stock and calculate subtotal using active DB prices
        for (CartItem item : cart.getItems()) {
            Product currentProduct = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + item.getProduct().getName()));

            if (!currentProduct.isActive() || currentProduct.getStockQuantity() < item.getQuantity()) {
                throw new InsufficientStockException("Item '" + currentProduct.getName() + "' does not have sufficient stock (" + currentProduct.getStockQuantity() + " remaining).");
            }

            subtotal = subtotal.add(currentProduct.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            totalItems += item.getQuantity();
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        String appliedCouponCode = null;
        String couponMessage = null;

        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            try {
                Coupon coupon = couponService.findValidCoupon(request.getCouponCode(), subtotal);
                if (coupon != null) {
                    discountAmount = couponService.calculateDiscount(coupon, subtotal);
                    appliedCouponCode = coupon.getCode();
                    couponMessage = "Coupon " + coupon.getCode() + " applied! Savings of ₹" + discountAmount;
                }
            } catch (BadRequestException ex) {
                couponMessage = ex.getMessage();
            }
        }

        boolean isFreeShipping = subtotal.compareTo(freeShippingThreshold) >= 0;
        BigDecimal shippingCharge = isFreeShipping ? BigDecimal.ZERO : standardShippingRate;
        BigDecimal amountNeeded = isFreeShipping ? BigDecimal.ZERO : freeShippingThreshold.subtract(subtotal);

        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingCharge).max(BigDecimal.ZERO);

        CheckoutDto.CheckoutSummaryResponse response = new CheckoutDto.CheckoutSummaryResponse();
        response.setSubtotal(subtotal);
        response.setDiscountAmount(discountAmount);
        response.setShippingCharge(shippingCharge);
        response.setTotalAmount(totalAmount);
        response.setAppliedCouponCode(appliedCouponCode);
        response.setCouponMessage(couponMessage);
        response.setFreeShipping(isFreeShipping);
        response.setAmountNeededForFreeShipping(amountNeeded);
        response.setTotalItems(totalItems);
        response.setItems(cartService.mapToCartResponse(cart).getItems());

        return response;
    }

    @Transactional
    public OrderDto.OrderResponse placeOrder(String sessionToken, CheckoutDto.PlaceOrderRequest request) {
        Cart cart = cartService.getOrCreateCart(sessionToken);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty shopping bag.");
        }

        User user = authService.getAuthenticatedUser();

        // Resolve shipping address
        String recipientName, addr1, addr2, landmark, city, state, postalCode;
        if (request.getAddressId() != null && user != null) {
            Address address = addressRepository.findByIdAndUserId(request.getAddressId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Selected delivery address not found."));
            recipientName = address.getRecipientName();
            addr1 = address.getAddressLine1();
            addr2 = address.getAddressLine2();
            landmark = address.getLandmark();
            city = address.getCity();
            state = address.getState();
            postalCode = address.getPostalCode();
        } else if (request.getGuestAddress() != null) {
            AddressDto.AddressRequest guestAddr = request.getGuestAddress();
            recipientName = guestAddr.getRecipientName();
            addr1 = guestAddr.getAddressLine1();
            addr2 = guestAddr.getAddressLine2();
            landmark = guestAddr.getLandmark();
            city = guestAddr.getCity();
            state = guestAddr.getState();
            postalCode = guestAddr.getPostalCode();
        } else {
            throw new BadRequestException("A valid delivery address must be provided.");
        }

        // Calculate and revalidate order items, decrement stock atomically
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setCustomerEmail(request.getCustomerEmail().trim());
        order.setCustomerPhone(request.getCustomerPhone().trim());
        order.setShippingRecipientName(recipientName);
        order.setShippingAddressLine1(addr1);
        order.setShippingAddressLine2(addr2);
        order.setShippingLandmark(landmark);
        order.setShippingCity(city);
        order.setShippingState(state);
        order.setShippingPostalCode(postalCode);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNotes(request.getNotes());

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + cartItem.getProduct().getName()));

            if (!product.isActive() || product.getStockQuantity() < cartItem.getQuantity()) {
                throw new InsufficientStockException("Inventory changed: Saree '" + product.getName() + "' is out of stock.");
            }

            // Decrement stock safely
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductNameSnapshot(product.getName());
            orderItem.setSkuSnapshot(product.getSku());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPriceSnapshot(product.getPrice());
            orderItem.setSubtotalSnapshot(itemTotal);
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                orderItem.setImageUrlSnapshot(product.getImages().get(0).getImageUrl());
            }

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);

        // Coupon calculation
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponService.findValidCoupon(request.getCouponCode(), subtotal);
            if (coupon != null) {
                discount = couponService.calculateDiscount(coupon, subtotal);
                coupon.setTimesUsed(coupon.getTimesUsed() + 1);
                couponRepository.save(coupon);
            }
        }
        order.setDiscountAmount(discount);

        boolean isFreeShipping = subtotal.compareTo(freeShippingThreshold) >= 0;
        BigDecimal shipping = isFreeShipping ? BigDecimal.ZERO : standardShippingRate;
        order.setShippingCharge(shipping);

        BigDecimal total = subtotal.subtract(discount).add(shipping).max(BigDecimal.ZERO);
        order.setTotalAmount(total);

        // Status assignment
        if (request.getPaymentMethod() == PaymentMethod.COD) {
            order.setOrderStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            order.setOrderStatus(OrderStatus.PAYMENT_PENDING);
            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        Order savedOrder = orderRepository.save(order);

        // Initial status history log
        OrderStatusHistory history = new OrderStatusHistory(
                savedOrder,
                null,
                savedOrder.getOrderStatus(),
                "Order created with " + request.getPaymentMethod().name() + " payment method.",
                user != null ? user.getEmail() : "GUEST"
        );
        orderStatusHistoryRepository.save(history);

        // Clear shopping cart after successful order creation
        cartService.clearCart(cart);

        OrderDto.OrderResponse response = mapToOrderResponse(savedOrder);

        // If Razorpay, generate order details
        if (request.getPaymentMethod() == PaymentMethod.RAZORPAY) {
            PaymentDto.RazorpayOrderResponse rzp = paymentService.createRazorpayOrderDetails(savedOrder);
            response.setRazorpayOrderId(rzp.getOrderId());
            response.setRazorpayKeyId(rzp.getKeyId());
        }

        return response;
    }

    public OrderDto.OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumber));
        return mapToOrderResponse(order);
    }

    public List<OrderDto.OrderResponse> getCustomerOrders() {
        User user = authService.getAuthenticatedUser();
        if (user == null) {
            throw new BadRequestException("Must be logged in to view order history.");
        }

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public Page<OrderDto.OrderResponse> getAllOrdersForAdmin(int page, int size, OrderStatus status) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
        Page<Order> orders = status != null ?
                orderRepository.findByOrderStatusOrderByCreatedAtDesc(status, pageable) :
                orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        return orders.map(this::mapToOrderResponse);
    }

    @Transactional
    public OrderDto.OrderResponse updateOrderStatus(Long orderId, OrderDto.UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus oldStatus = order.getOrderStatus();
        order.setOrderStatus(request.getStatus());

        if (request.getStatus() == OrderStatus.DELIVERED && order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }

        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isBlank()) {
            order.setTrackingNumber(request.getTrackingNumber().trim());
        }
        if (request.getCourierName() != null && !request.getCourierName().isBlank()) {
            order.setCourierName(request.getCourierName().trim());
        }

        Order saved = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory(
                saved,
                oldStatus,
                request.getStatus(),
                request.getRemarks() != null ? request.getRemarks() : "Status updated by admin",
                "ADMIN"
        );
        orderStatusHistoryRepository.save(history);

        return mapToOrderResponse(saved);
    }

    public OrderDto.OrderResponse mapToOrderResponse(Order order) {
        OrderDto.OrderResponse resp = new OrderDto.OrderResponse();
        resp.setId(order.getId());
        resp.setOrderNumber(order.getOrderNumber());
        resp.setCustomerEmail(order.getCustomerEmail());
        resp.setCustomerPhone(order.getCustomerPhone());
        resp.setShippingRecipientName(order.getShippingRecipientName());
        resp.setShippingAddressLine1(order.getShippingAddressLine1());
        resp.setShippingAddressLine2(order.getShippingAddressLine2());
        resp.setShippingLandmark(order.getShippingLandmark());
        resp.setShippingCity(order.getShippingCity());
        resp.setShippingState(order.getShippingState());
        resp.setShippingPostalCode(order.getShippingPostalCode());
        resp.setSubtotal(order.getSubtotal());
        resp.setDiscountAmount(order.getDiscountAmount());
        resp.setShippingCharge(order.getShippingCharge());
        resp.setTotalAmount(order.getTotalAmount());
        resp.setPaymentMethod(order.getPaymentMethod());
        resp.setPaymentStatus(order.getPaymentStatus());
        resp.setOrderStatus(order.getOrderStatus());
        resp.setTrackingNumber(order.getTrackingNumber());
        resp.setCourierName(order.getCourierName());
        resp.setNotes(order.getNotes());
        resp.setCreatedAt(order.getCreatedAt());

        if (order.getItems() != null) {
            resp.setItems(order.getItems().stream().map(item -> {
                OrderDto.OrderItemResponse ir = new OrderDto.OrderItemResponse();
                ir.setId(item.getId());
                ir.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
                ir.setProductName(item.getProductNameSnapshot());
                ir.setSku(item.getSkuSnapshot());
                ir.setImageUrl(item.getImageUrlSnapshot());
                ir.setQuantity(item.getQuantity());
                ir.setUnitPrice(item.getUnitPriceSnapshot());
                ir.setSubtotal(item.getSubtotalSnapshot());
                return ir;
            }).collect(Collectors.toList()));
        }

        return resp;
    }

    private String generateOrderNumber() {
        SecureRandom random = new SecureRandom();
        int randomCode = 100000 + random.nextInt(900000);
        return "SS-" + randomCode;
    }
}
