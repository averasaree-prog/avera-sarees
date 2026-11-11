package com.saanvi.sarees.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminDto {

    public static class DashboardMetrics {
        private BigDecimal totalRevenue;
        private long totalOrders;
        private long totalProducts;
        private long totalCustomers;
        private long lowStockCount;
        private long pendingReviewsCount;
        private List<OrderDto.OrderResponse> recentOrders;

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        public long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
        public long getTotalProducts() { return totalProducts; }
        public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
        public long getTotalCustomers() { return totalCustomers; }
        public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
        public long getLowStockCount() { return lowStockCount; }
        public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }
        public long getPendingReviewsCount() { return pendingReviewsCount; }
        public void setPendingReviewsCount(long pendingReviewsCount) { this.pendingReviewsCount = pendingReviewsCount; }
        public List<OrderDto.OrderResponse> getRecentOrders() { return recentOrders; }
        public void setRecentOrders(List<OrderDto.OrderResponse> recentOrders) { this.recentOrders = recentOrders; }
    }
}
