package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.AdminDto;
import com.saanvi.sarees.dto.OrderDto;
import com.saanvi.sarees.entity.Order;
import com.saanvi.sarees.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductReviewRepository reviewRepository;
    private final OrderService orderService;

    public AdminService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        ProductReviewRepository reviewRepository,
                        OrderService orderService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.orderService = orderService;
    }

    public AdminDto.DashboardMetrics getDashboardMetrics() {
        AdminDto.DashboardMetrics metrics = new AdminDto.DashboardMetrics();

        BigDecimal revenue = orderRepository.calculateTotalRevenue();
        metrics.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        metrics.setTotalOrders(orderRepository.count());
        metrics.setTotalProducts(productRepository.count());
        metrics.setTotalCustomers(userRepository.count());
        metrics.setLowStockCount(productRepository.countByStockQuantityLessThan(5));
        metrics.setPendingReviewsCount(reviewRepository.countByIsApprovedFalse());

        List<Order> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc();
        metrics.setRecentOrders(recentOrders.stream()
                .map(orderService::mapToOrderResponse)
                .collect(Collectors.toList()));

        return metrics;
    }
}
