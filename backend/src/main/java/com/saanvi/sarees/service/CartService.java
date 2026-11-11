package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.CartDto;
import com.saanvi.sarees.entity.Cart;
import com.saanvi.sarees.entity.CartItem;
import com.saanvi.sarees.entity.Product;
import com.saanvi.sarees.entity.User;
import com.saanvi.sarees.exception.BadRequestException;
import com.saanvi.sarees.exception.InsufficientStockException;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.CartItemRepository;
import com.saanvi.sarees.repository.CartRepository;
import com.saanvi.sarees.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       AuthService authService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.authService = authService;
    }

    @Transactional
    public Cart getOrCreateCart(String sessionToken) {
        User user = authService.getAuthenticatedUser();

        if (user != null) {
            Optional<Cart> userCartOpt = cartRepository.findByUserId(user.getId());
            if (userCartOpt.isPresent()) {
                Cart userCart = userCartOpt.get();
                // If there's an existing guest cart session, merge its items into the user's cart
                if (sessionToken != null && !sessionToken.isBlank()) {
                    cartRepository.findBySessionToken(sessionToken).ifPresent(guestCart -> {
                        if (!guestCart.getId().equals(userCart.getId())) {
                            mergeCarts(guestCart, userCart);
                            cartRepository.delete(guestCart);
                        }
                    });
                }
                return userCart;
            } else {
                Cart newCart = new Cart(user);
                return cartRepository.save(newCart);
            }
        }

        // Guest user by session token
        if (sessionToken != null && !sessionToken.isBlank()) {
            return cartRepository.findBySessionToken(sessionToken)
                    .orElseGet(() -> cartRepository.save(new Cart(sessionToken)));
        }

        // Generate new session token if none provided
        String newSessionToken = UUID.randomUUID().toString();
        return cartRepository.save(new Cart(newSessionToken));
    }

    @Transactional
    public CartDto.CartResponse getCartResponse(String sessionToken) {
        Cart cart = getOrCreateCart(sessionToken);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartDto.CartResponse addToCart(CartDto.AddToCartRequest request, String sessionToken) {
        Cart cart = getOrCreateCart(sessionToken);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (!product.isActive() || product.getStockQuantity() <= 0) {
            throw new InsufficientStockException("Selected saree is currently out of stock.");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        int newQuantity = request.getQuantity();
        if (existingItem.isPresent()) {
            newQuantity += existingItem.get().getQuantity();
            if (newQuantity > product.getStockQuantity()) {
                throw new InsufficientStockException("Only " + product.getStockQuantity() + " pieces available in stock.");
            }
            existingItem.get().setQuantity(newQuantity);
            cartItemRepository.save(existingItem.get());
        } else {
            if (newQuantity > product.getStockQuantity()) {
                throw new InsufficientStockException("Only " + product.getStockQuantity() + " pieces available in stock.");
            }
            CartItem item = new CartItem(cart, product, newQuantity);
            cart.getItems().add(item);
            cartItemRepository.save(item);
        }

        return mapToCartResponse(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Transactional
    public CartDto.CartResponse updateQuantity(Long itemId, int quantity, String sessionToken) {
        if (quantity < 1) {
            return removeItem(itemId, sessionToken);
        }

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity > item.getProduct().getStockQuantity()) {
            throw new InsufficientStockException("Requested quantity exceeds available stock (" + item.getProduct().getStockQuantity() + ").");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return mapToCartResponse(item.getCart());
    }

    @Transactional
    public CartDto.CartResponse removeItem(Long itemId, String sessionToken) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return mapToCartResponse(cart);
    }

    @Transactional
    public void clearCart(Cart cart) {
        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private void mergeCarts(Cart fromCart, Cart toCart) {
        for (CartItem fromItem : fromCart.getItems()) {
            Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(toCart.getId(), fromItem.getProduct().getId());
            if (existing.isPresent()) {
                int combinedQty = existing.get().getQuantity() + fromItem.getQuantity();
                int maxQty = Math.min(combinedQty, fromItem.getProduct().getStockQuantity());
                existing.get().setQuantity(maxQty);
                cartItemRepository.save(existing.get());
            } else {
                CartItem newItem = new CartItem(toCart, fromItem.getProduct(), fromItem.getQuantity());
                toCart.getItems().add(newItem);
                cartItemRepository.save(newItem);
            }
        }
    }

    public CartDto.CartResponse mapToCartResponse(Cart cart) {
        List<CartDto.CartItemResponse> itemResponses = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
            totalItems += item.getQuantity();

            CartDto.CartItemResponse itemResp = new CartDto.CartItemResponse();
            itemResp.setId(item.getId());
            itemResp.setProductId(product.getId());
            itemResp.setProductName(product.getName());
            itemResp.setProductSlug(product.getSlug());
            itemResp.setSku(product.getSku());
            itemResp.setUnitPrice(product.getPrice());
            itemResp.setOriginalPrice(product.getOriginalPrice());
            itemResp.setQuantity(item.getQuantity());
            itemResp.setSubtotal(itemTotal);
            itemResp.setAvailableStock(product.getStockQuantity());

            if (product.getImages() != null && !product.getImages().isEmpty()) {
                itemResp.setPrimaryImage(product.getImages().get(0).getImageUrl());
            }

            itemResponses.add(itemResp);
        }

        return new CartDto.CartResponse(cart.getId(), itemResponses, totalItems, subtotal);
    }
}
