package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.dto.PaymentDto;
import com.saanvi.sarees.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Endpoints for Razorpay payment verification and webhooks")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/razorpay/verify")
    @Operation(summary = "Verify Razorpay payment signature and confirm order")
    public ResponseEntity<ApiResponse<Boolean>> verifyPayment(@Valid @RequestBody PaymentDto.RazorpayVerifyRequest request) {
        boolean verified = paymentService.verifyRazorpayPayment(request);
        return ResponseEntity.ok(ApiResponse.success(verified, "Payment verified successfully. Order is confirmed!"));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Handle asynchronous webhook events from Razorpay")
    public ResponseEntity<ApiResponse<String>> handleWebhook(@RequestBody(required = false) Map<String, Object> payload) {
        // Idempotent webhook receiver
        return ResponseEntity.ok(ApiResponse.success("Webhook received"));
    }
}
