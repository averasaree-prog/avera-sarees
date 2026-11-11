package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.dto.CheckoutDto;
import com.saanvi.sarees.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@Tag(name = "Checkout", description = "Server-side price, coupon, and inventory validation for checkout")
public class CheckoutController {

    private final OrderService orderService;

    public CheckoutController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/summary")
    @Operation(summary = "Calculate order pricing breakdown, coupons, and free shipping threshold")
    public ResponseEntity<ApiResponse<CheckoutDto.CheckoutSummaryResponse>> getSummary(
            @RequestBody(required = false) CheckoutDto.CheckoutSummaryRequest request,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {
        if (request == null) {
            request = new CheckoutDto.CheckoutSummaryRequest();
        }
        CheckoutDto.CheckoutSummaryResponse summary = orderService.calculateCheckoutSummary(sessionToken, request);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
