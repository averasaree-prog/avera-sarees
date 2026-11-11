package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.dto.CartDto;
import com.saanvi.sarees.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Shopping Cart", description = "Endpoints for managing customer and guest shopping bags")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current cart contents")
    public ResponseEntity<ApiResponse<CartDto.CartResponse>> getCart(
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCartResponse(sessionToken)));
    }

    @PostMapping("/items")
    @Operation(summary = "Add saree item to cart")
    public ResponseEntity<ApiResponse<CartDto.CartResponse>> addToCart(
            @Valid @RequestBody CartDto.AddToCartRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        CartDto.CartResponse response = cartService.addToCart(request, sessionToken);
        return ResponseEntity.ok(ApiResponse.success(response, "Added to shopping bag."));
    }

    @PatchMapping("/items/{id}")
    @Operation(summary = "Update quantity of a cart item")
    public ResponseEntity<ApiResponse<CartDto.CartResponse>> updateQuantity(
            @PathVariable Long id,
            @Valid @RequestBody CartDto.UpdateQuantityRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        CartDto.CartResponse response = cartService.updateQuantity(id, request.getQuantity(), sessionToken);
        return ResponseEntity.ok(ApiResponse.success(response, "Shopping bag updated."));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remove an item from cart")
    public ResponseEntity<ApiResponse<CartDto.CartResponse>> removeItem(
            @PathVariable Long id,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        CartDto.CartResponse response = cartService.removeItem(id, sessionToken);
        return ResponseEntity.ok(ApiResponse.success(response, "Item removed from bag."));
    }
}
