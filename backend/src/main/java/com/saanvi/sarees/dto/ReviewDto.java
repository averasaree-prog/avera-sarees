package com.saanvi.sarees.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class ReviewDto {

    public static class CreateReviewRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotBlank(message = "Your name is required")
        private String customerName;

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating cannot exceed 5")
        private Integer rating;

        private String title;

        @NotBlank(message = "Review comment is required")
        private String comment;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class ReviewResponse {
        private Long id;
        private Long productId;
        private String customerName;
        private int rating;
        private String title;
        private String comment;
        private boolean isVerifiedPurchase;
        private Instant createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public boolean isVerifiedPurchase() { return isVerifiedPurchase; }
        public void setVerifiedPurchase(boolean verifiedPurchase) { isVerifiedPurchase = verifiedPurchase; }
        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    }
}
