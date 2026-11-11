package com.saanvi.sarees.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class CartDto {

    public static class AddToCartRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @Min(value = 1, message = "Quantity must be at least 1")
        private int quantity = 1;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    public static class UpdateQuantityRequest {
        @Min(value = 0, message = "Quantity must be at least 0")
        private int quantity;

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productSlug;
        private String sku;
        private String primaryImage;
        private BigDecimal unitPrice;
        private BigDecimal originalPrice;
        private int quantity;
        private BigDecimal subtotal;
        private int availableStock;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getProductSlug() { return productSlug; }
        public void setProductSlug(String productSlug) { this.productSlug = productSlug; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public String getPrimaryImage() { return primaryImage; }
        public void setPrimaryImage(String primaryImage) { this.primaryImage = primaryImage; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public BigDecimal getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
        public int getAvailableStock() { return availableStock; }
        public void setAvailableStock(int availableStock) { this.availableStock = availableStock; }
    }

    public static class CartResponse {
        private Long id;
        private List<CartItemResponse> items;
        private int totalItems;
        private BigDecimal subtotal;

        public CartResponse() {}
        public CartResponse(Long id, List<CartItemResponse> items, int totalItems, BigDecimal subtotal) {
            this.id = id;
            this.items = items;
            this.totalItems = totalItems;
            this.subtotal = subtotal;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public List<CartItemResponse> getItems() { return items; }
        public void setItems(List<CartItemResponse> items) { this.items = items; }
        public int getTotalItems() { return totalItems; }
        public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }
}
