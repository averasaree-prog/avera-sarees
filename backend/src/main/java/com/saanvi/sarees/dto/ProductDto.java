package com.saanvi.sarees.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class ProductDto {

    public static class CategoryResponse {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private String imageUrl;
        private int displayOrder;
        private boolean isActive;

        public CategoryResponse() {}

        public CategoryResponse(Long id, String name, String slug, String description, String imageUrl, int displayOrder, boolean isActive) {
            this.id = id;
            this.name = name;
            this.slug = slug;
            this.description = description;
            this.imageUrl = imageUrl;
            this.displayOrder = displayOrder;
            this.isActive = isActive;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public int getDisplayOrder() { return displayOrder; }
        public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
        public boolean isActive() { return isActive; }
        public void setActive(boolean active) { isActive = active; }
    }

    public static class CategoryRequest {
        @NotBlank(message = "Category name is required")
        private String name;
        private String description;
        private String imageUrl;
        private int displayOrder = 0;
        private boolean isActive = true;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public int getDisplayOrder() { return displayOrder; }
        public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
        public boolean isActive() { return isActive; }
        public void setActive(boolean active) { isActive = active; }
    }

    public static class ProductImageResponse {
        private Long id;
        private String imageUrl;
        private String altText;
        private int displayOrder;
        private boolean isPrimary;

        public ProductImageResponse() {}
        public ProductImageResponse(Long id, String imageUrl, String altText, int displayOrder, boolean isPrimary) {
            this.id = id;
            this.imageUrl = imageUrl;
            this.altText = altText;
            this.displayOrder = displayOrder;
            this.isPrimary = isPrimary;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public String getAltText() { return altText; }
        public void setAltText(String altText) { this.altText = altText; }
        public int getDisplayOrder() { return displayOrder; }
        public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
        public boolean isPrimary() { return isPrimary; }
        public void setPrimary(boolean primary) { isPrimary = primary; }
    }

    public static class ProductResponse {
        private Long id;
        private String name;
        private String slug;
        private String sku;
        private String shortDescription;
        private String description;
        private String fabric;
        private String weave;
        private String occasion;
        private String pattern;
        private String color;
        private BigDecimal sareeLengthMeters;
        private String blousePieceDetails;
        private String careInstructions;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer discountPercentage;
        private Integer stockQuantity;
        private boolean isFeatured;
        private boolean isBestSeller;
        private boolean isNewArrival;
        private boolean inStock;
        private CategoryResponse category;
        private List<ProductImageResponse> images;
        private Double averageRating;
        private Long reviewCount;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public String getShortDescription() { return shortDescription; }
        public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getFabric() { return fabric; }
        public void setFabric(String fabric) { this.fabric = fabric; }
        public String getWeave() { return weave; }
        public void setWeave(String weave) { this.weave = weave; }
        public String getOccasion() { return occasion; }
        public void setOccasion(String occasion) { this.occasion = occasion; }
        public String getPattern() { return pattern; }
        public void setPattern(String pattern) { this.pattern = pattern; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
        public BigDecimal getSareeLengthMeters() { return sareeLengthMeters; }
        public void setSareeLengthMeters(BigDecimal sareeLengthMeters) { this.sareeLengthMeters = sareeLengthMeters; }
        public String getBlousePieceDetails() { return blousePieceDetails; }
        public void setBlousePieceDetails(String blousePieceDetails) { this.blousePieceDetails = blousePieceDetails; }
        public String getCareInstructions() { return careInstructions; }
        public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public BigDecimal getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
        public Integer getDiscountPercentage() { return discountPercentage; }
        public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }
        public Integer getStockQuantity() { return stockQuantity; }
        public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
        public boolean isFeatured() { return isFeatured; }
        public void setFeatured(boolean featured) { isFeatured = featured; }
        public boolean isBestSeller() { return powerIsBestSeller(); }
        public boolean powerIsBestSeller() { return isBestSeller; }
        public void setBestSeller(boolean bestSeller) { isBestSeller = bestSeller; }
        public boolean isNewArrival() { return isNewArrival; }
        public void setNewArrival(boolean newArrival) { isNewArrival = newArrival; }
        public boolean isInStock() { return inStock; }
        public void setInStock(boolean inStock) { this.inStock = inStock; }
        public CategoryResponse getCategory() { return category; }
        public void setCategory(CategoryResponse category) { this.category = category; }
        public List<ProductImageResponse> getImages() { return images; }
        public void setImages(List<ProductImageResponse> images) { this.images = images; }
        public Double getAverageRating() { return averageRating; }
        public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
        public Long getReviewCount() { return reviewCount; }
        public void setReviewCount(Long reviewCount) { this.reviewCount = reviewCount; }
    }

    public static class ProductCreateRequest {
        @NotBlank(message = "Product name is required")
        private String name;

        @NotBlank(message = "SKU is required")
        private String sku;

        private String shortDescription;
        private String description;

        @NotBlank(message = "Fabric is required")
        private String fabric;

        private String weave;
        private String occasion;
        private String pattern;
        private String color;
        private BigDecimal sareeLengthMeters;
        private String blousePieceDetails;
        private String careInstructions;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than zero")
        private BigDecimal price;

        private BigDecimal originalPrice;

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        private Integer stockQuantity;

        @NotNull(message = "Category ID is required")
        private Long categoryId;

        private boolean isFeatured = false;
        private boolean isBestSeller = false;
        private boolean isNewArrival = true;

        private List<String> imageUrls;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public String getShortDescription() { return shortDescription; }
        public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getFabric() { return fabric; }
        public void setFabric(String fabric) { this.fabric = fabric; }
        public String getWeave() { return weave; }
        public void setWeave(String weave) { this.weave = weave; }
        public String getOccasion() { return occasion; }
        public void setOccasion(String occasion) { this.occasion = occasion; }
        public String getPattern() { return pattern; }
        public void setPattern(String pattern) { this.pattern = pattern; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
        public BigDecimal getSareeLengthMeters() { return sareeLengthMeters; }
        public void setSareeLengthMeters(BigDecimal sareeLengthMeters) { this.sareeLengthMeters = sareeLengthMeters; }
        public String getBlousePieceDetails() { return blousePieceDetails; }
        public void setBlousePieceDetails(String blousePieceDetails) { this.blousePieceDetails = blousePieceDetails; }
        public String getCareInstructions() { return careInstructions; }
        public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public BigDecimal getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
        public Integer getStockQuantity() { return stockQuantity; }
        public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public boolean isFeatured() { return isFeatured; }
        public void setFeatured(boolean featured) { isFeatured = featured; }
        public boolean isBestSeller() { return isBestSeller; }
        public void setBestSeller(boolean bestSeller) { isBestSeller = bestSeller; }
        public boolean isNewArrival() { return isNewArrival; }
        public void setNewArrival(boolean newArrival) { isNewArrival = newArrival; }
        public List<String> getImageUrls() { return imageUrls; }
        public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    }
}
