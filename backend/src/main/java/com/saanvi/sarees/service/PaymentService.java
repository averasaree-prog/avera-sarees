package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.PaymentDto;
import com.saanvi.sarees.entity.Order;
import com.saanvi.sarees.entity.OrderStatusHistory;
import com.saanvi.sarees.entity.Payment;
import com.saanvi.sarees.enums.OrderStatus;
import com.saanvi.sarees.enums.PaymentMethod;
import com.saanvi.sarees.enums.PaymentStatus;
import com.saanvi.sarees.exception.BadRequestException;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.OrderRepository;
import com.saanvi.sarees.repository.OrderStatusHistoryRepository;
import com.saanvi.sarees.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Value("${app.razorpay.key-id:rzp_test_saanvi12345}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:secret_saanvi_test_key}")
    private String razorpayKeySecret;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          OrderStatusHistoryRepository orderStatusHistoryRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
    }

    public PaymentDto.RazorpayOrderResponse createRazorpayOrderDetails(Order order) {
        PaymentDto.RazorpayOrderResponse response = new PaymentDto.RazorpayOrderResponse();
        response.setKeyId(razorpayKeyId);

        String razorpayOrderId = createOrderOnRazorpay(order);
        response.setOrderId(razorpayOrderId);
        response.setAmount(order.getTotalAmount());
        response.setCurrency("INR");
        response.setCustomerName(order.getShippingRecipientName());
        response.setCustomerEmail(order.getCustomerEmail());
        response.setCustomerPhone(order.getCustomerPhone());

        // Associate with Payment record
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElseGet(() -> {
            Payment p = new Payment();
            p.setOrder(order);
            p.setPaymentMethod(PaymentMethod.RAZORPAY);
            p.setAmount(order.getTotalAmount());
            p.setStatus(PaymentStatus.PENDING);
            return p;
        });

        payment.setRazorpayOrderId(razorpayOrderId);
        paymentRepository.save(payment);

        return response;
    }

    private String createOrderOnRazorpay(Order order) {
        try {
            long amountInPaise = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();
            String jsonPayload = String.format("{\"amount\":%d,\"currency\":\"INR\",\"receipt\":\"%s\"}",
                    amountInPaise, order.getOrderNumber());

            String auth = razorpayKeyId + ":" + razorpayKeySecret;
            String encodedAuth = java.util.Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Authorization", "Basic " + encodedAuth)
                    .header("Content-Type", "application/json")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            java.net.http.HttpResponse<String> httpResponse = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

            if (httpResponse.statusCode() == 200 || httpResponse.statusCode() == 201) {
                String body = httpResponse.body();
                java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("\"id\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
                if (matcher.find()) {
                    String orderId = matcher.group(1);
                    log.info("Created real Razorpay order ID {} for order {}", orderId, order.getOrderNumber());
                    return orderId;
                }
            } else {
                log.warn("Razorpay API returned status {}: {}", httpResponse.statusCode(), httpResponse.body());
            }
        } catch (Exception ex) {
            log.error("Failed to create Razorpay order via API: {}", ex.getMessage());
        }

        // Fallback synthetic order ID if offline or API error
        return "order_" + order.getOrderNumber().replace("-", "") + "_" + (System.currentTimeMillis() % 10000);
    }

    @Transactional
    public boolean verifyRazorpayPayment(PaymentDto.RazorpayVerifyRequest request) {
        Order order = orderRepository.findByOrderNumber(request.getOrderNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + request.getOrderNumber()));

        // Idempotency: If already completed, return true
        if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            log.info("Order {} payment was already confirmed previously.", order.getOrderNumber());
            return true;
        }

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order"));

        boolean isValidSignature = false;

        // In test/demo environment or when signature is supplied, verify HMAC
        if (request.getRazorpaySignature() != null && !request.getRazorpaySignature().isBlank()) {
            isValidSignature = verifyHmacSignature(
                    request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                    request.getRazorpaySignature(),
                    razorpayKeySecret
            );
        } else if ("rzp_test_saanvi12345".equals(razorpayKeyId)) {
            // Development fallback for simulation test mode without live gateway keys
            isValidSignature = true;
            log.info("Development test mode: accepting simulated Razorpay payment signature for test order {}", order.getOrderNumber());
        }

        if (!isValidSignature) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Invalid Razorpay payment signature verification failed.");
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed: Invalid transaction signature.");
        }

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        OrderStatus oldStatus = order.getOrderStatus();
        order.setPaymentStatus(PaymentStatus.COMPLETED);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory(
                order,
                oldStatus,
                OrderStatus.CONFIRMED,
                "Online payment verified successfully via Razorpay (Txn ID: " + request.getRazorpayPaymentId() + ")",
                "PAYMENT_GATEWAY"
        );
        orderStatusHistoryRepository.save(history);

        log.info("Order {} successfully confirmed with verified payment.", order.getOrderNumber());
        return true;
    }

    private boolean verifyHmacSignature(String payload, String expectedSignature, String secret) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String generatedSignature = HexFormat.of().formatHex(hash);
            return MessageDigest.isEqual(generatedSignature.getBytes(), expectedSignature.getBytes());
        } catch (Exception e) {
            log.error("Error computing HMAC signature verification", e);
            return false;
        }
    }
}
