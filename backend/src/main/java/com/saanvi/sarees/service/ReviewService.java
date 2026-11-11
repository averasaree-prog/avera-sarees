package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.ReviewDto;
import com.saanvi.sarees.entity.Product;
import com.saanvi.sarees.entity.ProductReview;
import com.saanvi.sarees.entity.User;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.ProductRepository;
import com.saanvi.sarees.repository.ProductReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    public ReviewService(ProductReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         AuthService authService) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.authService = authService;
    }

    public List<ReviewDto.ReviewResponse> getApprovedReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto.ReviewResponse createReview(ReviewDto.CreateReviewRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        User user = authService.getAuthenticatedUser();

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setCustomerName(user != null ? user.getFullName() : request.getCustomerName().trim());
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment().trim());
        review.setApproved(true); // auto-approve genuine review, moderatable via admin
        review.setVerifiedPurchase(user != null);

        ProductReview saved = reviewRepository.save(review);
        return mapToReviewResponse(saved);
    }

    public Page<ReviewDto.ReviewResponse> getAllReviewsForAdmin(int page, int size) {
        return reviewRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(Math.max(0, page), Math.max(1, size)))
                .map(this::mapToReviewResponse);
    }

    @Transactional
    public void toggleReviewApproval(Long reviewId, boolean approved) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        review.setApproved(approved);
        reviewRepository.save(review);
    }

    public ReviewDto.ReviewResponse mapToReviewResponse(ProductReview review) {
        ReviewDto.ReviewResponse resp = new ReviewDto.ReviewResponse();
        resp.setId(review.getId());
        resp.setProductId(review.getProduct().getId());
        resp.setCustomerName(review.getCustomerName());
        resp.setRating(review.getRating());
        resp.setTitle(review.getTitle());
        resp.setComment(review.getComment());
        resp.setVerifiedPurchase(review.isVerifiedPurchase());
        resp.setCreatedAt(review.getCreatedAt());
        return resp;
    }
}
