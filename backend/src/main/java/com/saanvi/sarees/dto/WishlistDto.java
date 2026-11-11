package com.saanvi.sarees.dto;

import java.math.BigDecimal;
import java.util.List;

public class WishlistDto {

    public static class WishlistItemResponse {
        private Long id;
        private Long productId;
        private String name;
        private String slug;
        private String sku;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private String primaryImage;
        private boolean inStock;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public BigDecimal getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
        public String getPrimaryImage() { return primaryImage; }
        public void setPrimaryImage(String primaryImage) { this.primaryImage = primaryImage; }
        public boolean isInStock() { return inStock; }
        public void setInStock(boolean inStock) { this.inStock = inStock; }
    }

    public static class WishlistResponse {
        private Long id;
        private List<WishlistItemResponse> items;
        private int totalItems;

        public WishlistResponse(Long id, List<WishlistItemResponse> items) {
            this.id = id;
            this.items = items;
            this.totalItems = items != null ? items.size() : 0;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public List<WishlistItemResponse> getItems() { return items; }
        public void setItems(List<WishlistItemResponse> items) { this.items = items; }
        public int getTotalItems() { return totalItems; }
        public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
    }
}
