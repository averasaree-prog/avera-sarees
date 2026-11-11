package com.saanvi.sarees.dto;

import com.saanvi.sarees.enums.OrderStatus;
import com.saanvi.sarees.enums.PaymentMethod;
import com.saanvi.sarees.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderDto {

    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String sku;
        private String imageUrl;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    public static class OrderResponse {
        private Long id;
        private String orderNumber;
        private String customerEmail;
        private String customerPhone;
        private String shippingRecipientName;
        private String shippingAddressLine1;
        private String shippingAddressLine2;
        private String shippingLandmark;
        private String shippingCity;
        private String shippingState;
        private String shippingPostalCode;
        private BigDecimal subtotal;
        private BigDecimal discountAmount;
        private BigDecimal shippingCharge;
        private BigDecimal totalAmount;
        private PaymentMethod paymentMethod;
        private PaymentStatus paymentStatus;
        private OrderStatus orderStatus;
        private String trackingNumber;
        private String courierName;
        private String notes;
        private List<OrderItemResponse> items;
        private String razorpayOrderId;
        private String razorpayKeyId;
        private Instant createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
        public String getCustomerPhone() { return customerPhone; }
        public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
        public String getShippingRecipientName() { return shippingRecipientName; }
        public void setShippingRecipientName(String shippingRecipientName) { this.shippingRecipientName = shippingRecipientName; }
        public String getShippingAddressLine1() { return shippingAddressLine1; }
        public void setShippingAddressLine1(String shippingAddressLine1) { this.shippingAddressLine1 = shippingAddressLine1; }
        public String getShippingAddressLine2() { return shippingAddressLine2; }
        public void setShippingAddressLine2(String shippingAddressLine2) { this.shippingAddressLine2 = shippingAddressLine2; }
        public String getShippingLandmark() { return shippingLandmark; }
        public void setShippingLandmark(String shippingLandmark) { this.shippingLandmark = shippingLandmark; }
        public String getShippingCity() { return shippingCity; }
        public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }
        public String getShippingState() { return shippingState; }
        public void setShippingState(String shippingState) { this.shippingState = shippingState; }
        public String getShippingPostalCode() { return shippingPostalCode; }
        public void setShippingPostalCode(String shippingPostalCode) { this.shippingPostalCode = shippingPostalCode; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
        public BigDecimal getShippingCharge() { return shippingCharge; }
        public void setShippingCharge(BigDecimal shippingCharge) { this.shippingCharge = shippingCharge; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public PaymentMethod getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
        public PaymentStatus getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
        public OrderStatus getOrderStatus() { return orderStatus; }
        public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }
        public String getTrackingNumber() { return trackingNumber; }
        public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
        public String getCourierName() { return courierName; }
        public void setCourierName(String courierName) { this.courierName = courierName; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public List<OrderItemResponse> getItems() { return items; }
        public void setItems(List<OrderItemResponse> items) { this.items = items; }
        public String getRazorpayOrderId() { return razorpayOrderId; }
        public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
        public String getRazorpayKeyId() { return razorpayKeyId; }
        public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }
        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    }

    public static class UpdateOrderStatusRequest {
        @NotNull(message = "Order status is required")
        private OrderStatus status;

        private String remarks;
        private String trackingNumber;
        private String courierName;

        public OrderStatus getStatus() { return status; }
        public void setStatus(OrderStatus status) { this.status = status; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
        public String getTrackingNumber() { return trackingNumber; }
        public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
        public String getCourierName() { return courierName; }
        public void setCourierName(String courierName) { this.courierName = courierName; }
    }
}
