package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.dto.ReviewDto;
import com.saanvi.sarees.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Product Reviews", description = "Endpoints for genuine customer reviews and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get all approved reviews for a given saree")
    public ResponseEntity<ApiResponse<List<ReviewDto.ReviewResponse>>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getApprovedReviewsForProduct(productId)));
    }

    @PostMapping
    @Operation(summary = "Submit a customer review and rating for a saree")
    public ResponseEntity<ApiResponse<ReviewDto.ReviewResponse>> createReview(@Valid @RequestBody ReviewDto.CreateReviewRequest request) {
        ReviewDto.ReviewResponse response = reviewService.createReview(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Thank you for your valuable review!"));
    }
}
