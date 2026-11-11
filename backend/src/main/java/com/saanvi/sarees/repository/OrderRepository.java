package com.saanvi.sarees.repository;

import com.saanvi.sarees.entity.Order;
import com.saanvi.sarees.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus orderStatus, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus != 'CANCELLED'")
    long countCompletedOrders();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderStatus != 'CANCELLED' AND o.paymentStatus = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();

    List<Order> findTop5ByOrderByCreatedAtDesc();
}
