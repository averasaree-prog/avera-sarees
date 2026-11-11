package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.*;
import com.saanvi.sarees.enums.OrderStatus;
import com.saanvi.sarees.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.saanvi.sarees.exception.BadRequestException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Operations", description = "Protected administrative dashboard, inventory, orders and category management")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final CouponService couponService;
    private final ReviewService reviewService;

    public AdminController(AdminService adminService,
                           OrderService orderService,
                           ProductService productService,
                           CategoryService categoryService,
                           CouponService couponService,
                           ReviewService reviewService) {
        this.adminService = adminService;
        this.orderService = orderService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.couponService = couponService;
        this.reviewService = reviewService;
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get high-level business analytics, revenue, orders and inventory alerts")
    public ResponseEntity<ApiResponse<AdminDto.DashboardMetrics>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardMetrics()));
    }

    @GetMapping("/orders")
    @Operation(summary = "List all customer orders with status filtering and pagination")
    public ResponseEntity<ApiResponse<Page<OrderDto.OrderResponse>>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrdersForAdmin(page, size, status)));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update order fulfillment lifecycle status and shipping courier tracking")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderDto.UpdateOrderStatusRequest request) {
        OrderDto.OrderResponse updated = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Order status updated to " + request.getStatus()));
    }

    @PostMapping("/products")
    @Operation(summary = "Add a new saree to the catalog")
    public ResponseEntity<ApiResponse<ProductDto.ProductResponse>> createProduct(
            @Valid @RequestBody ProductDto.ProductCreateRequest request) {
        ProductDto.ProductResponse product = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.success(product, "Product published successfully!"));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update an existing saree's details or inventory")
    public ResponseEntity<ApiResponse<ProductDto.ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDto.ProductCreateRequest request) {
        ProductDto.ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success(product, "Product updated successfully!"));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Soft delete / deactivate a product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deactivated."));
    }

    @GetMapping("/categories")
    @Operation(summary = "List all categories for admin management")
    public ResponseEntity<ApiResponse<List<ProductDto.CategoryResponse>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategoriesForAdmin()));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new saree category")
    public ResponseEntity<ApiResponse<ProductDto.CategoryResponse>> createCategory(
            @Valid @RequestBody ProductDto.CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.createCategory(request), "Category created."));
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update an existing saree category")
    public ResponseEntity<ApiResponse<ProductDto.CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody ProductDto.CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.updateCategory(id, request), "Category updated."));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete or deactivate a saree category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category removed."));
    }

    @GetMapping("/coupons")
    @Operation(summary = "List all discount coupons")
    public ResponseEntity<ApiResponse<List<CouponDto.CouponResponse>>> getCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAllCoupons()));
    }

    @PostMapping("/coupons")
    @Operation(summary = "Create a new promotional coupon")
    public ResponseEntity<ApiResponse<CouponDto.CouponResponse>> createCoupon(
            @Valid @RequestBody CouponDto.CouponCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(couponService.createCoupon(request), "Coupon activated."));
    }

    @PutMapping("/coupons/{id}")
    @Operation(summary = "Update an existing promotional coupon")
    public ResponseEntity<ApiResponse<CouponDto.CouponResponse>> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponDto.CouponCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(couponService.updateCoupon(id, request), "Coupon updated."));
    }

    @DeleteMapping("/coupons/{id}")
    @Operation(summary = "Delete a promotional coupon")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Coupon deleted."));
    }

    @GetMapping("/reviews")
    @Operation(summary = "List all customer reviews for moderation")
    public ResponseEntity<ApiResponse<Page<ReviewDto.ReviewResponse>>> getReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getAllReviewsForAdmin(page, size)));
    }

    @PatchMapping("/reviews/{id}/approval")
    @Operation(summary = "Approve or hide a customer review")
    public ResponseEntity<ApiResponse<Void>> toggleReviewApproval(
            @PathVariable Long id,
            @RequestParam boolean approved) {
        reviewService.toggleReviewApproval(id, approved);
        return ResponseEntity.ok(ApiResponse.success(null, "Review status updated."));
    }

    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload saree photo from local device")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadProductImage(
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Please select an image file to upload.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        List<String> allowed = Arrays.asList(".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif");
        if (!allowed.contains(extension)) {
            throw new BadRequestException("Supported formats are JPG, JPEG, PNG, WEBP, GIF, and AVIF.");
        }

        try {
            Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String uniqueName = "saree_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path targetLocation = uploadPath.resolve(uniqueName);
            try (java.io.InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            }

            String fileUrl = "/uploads/" + uniqueName;
            Map<String, String> data = new HashMap<>();
            data.put("url", fileUrl);
            data.put("filename", uniqueName);

            return ResponseEntity.ok(ApiResponse.success(data, "Saree photo uploaded successfully from device."));
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image on server: " + e.getMessage(), e);
        }
    }
}
