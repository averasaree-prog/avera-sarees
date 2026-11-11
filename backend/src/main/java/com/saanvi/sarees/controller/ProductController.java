package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.dto.ProductDto;
import com.saanvi.sarees.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Catalog", description = "Endpoints for browsing, filtering, searching and retrieving sarees")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Filter and search sarees catalog with pagination")
    public ResponseEntity<ApiResponse<Page<ProductDto.ProductResponse>>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String fabric,
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "false") boolean inStockOnly,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Page<ProductDto.ProductResponse> results = productService.getProducts(
                category, fabric, occasion, color, minPrice, maxPrice, inStockOnly, q, sort, page, size);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get detailed saree information by slug")
    public ResponseEntity<ApiResponse<ProductDto.ProductResponse>> getProductBySlug(@PathVariable String slug) {
        ProductDto.ProductResponse product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ProductDto.ProductResponse>> getProductById(@PathVariable Long id) {
        ProductDto.ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured sarees for homepage")
    public ResponseEntity<ApiResponse<List<ProductDto.ProductResponse>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success(productService.getFeaturedProducts()));
    }

    @GetMapping("/best-sellers")
    @Operation(summary = "Get best-selling sarees")
    public ResponseEntity<ApiResponse<List<ProductDto.ProductResponse>>> getBestSellers() {
        return ResponseEntity.ok(ApiResponse.success(productService.getBestSellers()));
    }

    @GetMapping("/new-arrivals")
    @Operation(summary = "Get newly curated saree arrivals")
    public ResponseEntity<ApiResponse<List<ProductDto.ProductResponse>>> getNewArrivals() {
        return ResponseEntity.ok(ApiResponse.success(productService.getNewArrivals()));
    }

    @GetMapping("/{id}/related")
    @Operation(summary = "Get related sarees by category")
    public ResponseEntity<ApiResponse<List<ProductDto.ProductResponse>>> getRelated(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getRelatedProducts(id)));
    }

    @GetMapping("/meta/fabrics")
    @Operation(summary = "Get distinct fabrics available in catalog")
    public ResponseEntity<ApiResponse<List<String>>> getFabrics() {
        return ResponseEntity.ok(ApiResponse.success(productService.getFabrics()));
    }

    @GetMapping("/meta/colors")
    @Operation(summary = "Get distinct colors available in catalog")
    public ResponseEntity<ApiResponse<List<String>>> getColors() {
        return ResponseEntity.ok(ApiResponse.success(productService.getColors()));
    }

    @GetMapping("/meta/occasions")
    @Operation(summary = "Get distinct occasions available in catalog")
    public ResponseEntity<ApiResponse<List<String>>> getOccasions() {
        return ResponseEntity.ok(ApiResponse.success(productService.getOccasions()));
    }
}
