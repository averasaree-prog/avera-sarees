package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.dto.WishlistDto;
import com.saanvi.sarees.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "Endpoints for customer saved favorite sarees")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get current customer's wishlist")
    public ResponseEntity<ApiResponse<WishlistDto.WishlistResponse>> getWishlist() {
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getWishlist()));
    }

    @PostMapping("/toggle/{productId}")
    @Operation(summary = "Add or remove a product from customer wishlist")
    public ResponseEntity<ApiResponse<WishlistDto.WishlistResponse>> toggleWishlist(@PathVariable Long productId) {
        WishlistDto.WishlistResponse response = wishlistService.toggleWishlist(productId);
        return ResponseEntity.ok(ApiResponse.success(response, "Wishlist updated."));
    }
}
