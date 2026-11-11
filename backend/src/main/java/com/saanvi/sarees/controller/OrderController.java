package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.dto.CheckoutDto;
import com.saanvi.sarees.dto.OrderDto;
import com.saanvi.sarees.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order placement, order history and live shipment tracking")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Place a new order with atomic inventory deduction")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> placeOrder(
            @Valid @RequestBody CheckoutDto.PlaceOrderRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        OrderDto.OrderResponse response = orderService.placeOrder(sessionToken, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Order placed successfully!"));
    }

    @GetMapping("/track/{orderNumber}")
    @Operation(summary = "Track order status and shipment by order number")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> trackOrder(@PathVariable String orderNumber) {
        OrderDto.OrderResponse response = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get order history for authenticated customer")
    public ResponseEntity<ApiResponse<List<OrderDto.OrderResponse>>> getMyOrders() {
        List<OrderDto.OrderResponse> orders = orderService.getCustomerOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }
}
