package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.ProductDto;
import com.saanvi.sarees.entity.Category;
import com.saanvi.sarees.entity.Product;
import com.saanvi.sarees.entity.ProductImage;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.CategoryRepository;
import com.saanvi.sarees.repository.ProductRepository;
import com.saanvi.sarees.repository.ProductReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductReviewRepository reviewRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          ProductReviewRepository reviewRepository,
                          CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
        this.categoryService = categoryService;
    }

    public Page<ProductDto.ProductResponse> getProducts(
            String categorySlug,
            String fabric,
            String occasion,
            String color,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            boolean inStockOnly,
            String searchQuery,
            String sortBy,
            int page,
            int size
    ) {
        Sort sort = switch (sortBy != null ? sortBy.toLowerCase() : "newest") {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "popularity" -> Sort.by(Sort.Direction.DESC, "isBestSeller").and(Sort.by(Sort.Direction.DESC, "createdAt"));
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Page<Product> products = productRepository.filterProducts(
                categorySlug != null && !categorySlug.isBlank() ? categorySlug.trim() : null,
                fabric != null && !fabric.isBlank() ? fabric.trim() : null,
                occasion != null && !occasion.isBlank() ? occasion.trim() : null,
                color != null && !color.isBlank() ? color.trim() : null,
                minPrice,
                maxPrice,
                inStockOnly,
                searchQuery != null && !searchQuery.isBlank() ? searchQuery.trim() : null,
                pageable
        );

        return products.map(this::mapToProductResponse);
    }

    public ProductDto.ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapToProductResponse(product);
    }

    public ProductDto.ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToProductResponse(product);
    }

    public List<ProductDto.ProductResponse> getFeaturedProducts() {
        return productRepository.findTop8ByIsActiveTrueAndIsFeaturedTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductDto.ProductResponse> getBestSellers() {
        return productRepository.findTop8ByIsActiveTrueAndIsBestSellerTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductDto.ProductResponse> getNewArrivals() {
        return productRepository.findTop8ByIsActiveTrueAndIsNewArrivalTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductDto.ProductResponse> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return productRepository.findRelatedProducts(product.getCategory().getId(), product.getId(), PageRequest.of(0, 4))
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<String> getFabrics() {
        return productRepository.findDistinctFabrics();
    }

    public List<String> getColors() {
        return productRepository.findDistinctColors();
    }

    public List<String> getOccasions() {
        return productRepository.findDistinctOccasions();
    }

    @Transactional
    public ProductDto.ProductResponse createProduct(ProductDto.ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String slug = generateSlug(request.getName()) + "-" + request.getSku().toLowerCase();

        Product product = new Product();
        product.setName(request.getName().trim());
        product.setSlug(slug);
        product.setSku(request.getSku().trim().toUpperCase());
        product.setShortDescription(request.getShortDescription());
        product.setDescription(request.getDescription());
        product.setFabric(request.getFabric());
        product.setWeave(request.getWeave());
        product.setOccasion(request.getOccasion());
        product.setPattern(request.getPattern());
        product.setColor(request.getColor());
        if (request.getSareeLengthMeters() != null) {
            product.setSareeLengthMeters(request.getSareeLengthMeters());
        }
        if (request.getBlousePieceDetails() != null) {
            product.setBlousePieceDetails(request.getBlousePieceDetails());
        }
        if (request.getCareInstructions() != null) {
            product.setCareInstructions(request.getCareInstructions());
        }
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice() != null ? request.getOriginalPrice() : request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setFeatured(request.isFeatured());
        product.setBestSeller(request.isBestSeller());
        product.setNewArrival(request.isNewArrival());
        product.setActive(true);

        calculateDiscount(product);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(new ProductImage(product, request.getImageUrls().get(i), product.getName(), i, i == 0));
            }
            product.setImages(images);
        }

        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
    }

    @Transactional
    public ProductDto.ProductResponse updateProduct(Long id, ProductDto.ProductCreateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName().trim());
        product.setSku(request.getSku().trim().toUpperCase());
        product.setShortDescription(request.getShortDescription());
        product.setDescription(request.getDescription());
        product.setFabric(request.getFabric());
        product.setWeave(request.getWeave());
        product.setOccasion(request.getOccasion());
        product.setPattern(request.getPattern());
        product.setColor(request.getColor());
        if (request.getSareeLengthMeters() != null) {
            product.setSareeLengthMeters(request.getSareeLengthMeters());
        }
        if (request.getBlousePieceDetails() != null) {
            product.setBlousePieceDetails(request.getBlousePieceDetails());
        }
        if (request.getCareInstructions() != null) {
            product.setCareInstructions(request.getCareInstructions());
        }
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setFeatured(request.isFeatured());
        product.setBestSeller(request.isBestSeller());
        product.setNewArrival(request.isNewArrival());

        calculateDiscount(product);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            product.getImages().clear();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                product.getImages().add(new ProductImage(product, request.getImageUrls().get(i), product.getName(), i, i == 0));
            }
        }

        return mapToProductResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    private void calculateDiscount(Product product) {
        if (product.getOriginalPrice() != null && product.getOriginalPrice().compareTo(product.getPrice()) > 0) {
            BigDecimal diff = product.getOriginalPrice().subtract(product.getPrice());
            BigDecimal pct = diff.multiply(new BigDecimal(100)).divide(product.getOriginalPrice(), 0, RoundingMode.HALF_UP);
            product.setDiscountPercentage(pct.intValue());
        } else {
            product.setDiscountPercentage(0);
        }
    }

    public ProductDto.ProductResponse mapToProductResponse(Product product) {
        ProductDto.ProductResponse response = new ProductDto.ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setSlug(product.getSlug());
        response.setSku(product.getSku());
        response.setShortDescription(product.getShortDescription());
        response.setDescription(product.getDescription());
        response.setFabric(product.getFabric());
        response.setWeave(product.getWeave());
        response.setOccasion(product.getOccasion());
        response.setPattern(product.getPattern());
        response.setColor(product.getColor());
        response.setSareeLengthMeters(product.getSareeLengthMeters());
        response.setBlousePieceDetails(product.getBlousePieceDetails());
        response.setCareInstructions(product.getCareInstructions());
        response.setPrice(product.getPrice());
        response.setOriginalPrice(product.getOriginalPrice());
        response.setDiscountPercentage(product.getDiscountPercentage());
        response.setStockQuantity(product.getStockQuantity());
        response.setInStock(product.getStockQuantity() != null && product.getStockQuantity() > 0);
        response.setFeatured(product.isFeatured());
        response.setBestSeller(product.isBestSeller());
        response.setNewArrival(product.isNewArrival());
        response.setCategory(categoryService.mapToCategoryResponse(product.getCategory()));

        if (product.getImages() != null) {
            response.setImages(product.getImages().stream()
                    .map(img -> new ProductDto.ProductImageResponse(
                            img.getId(), img.getImageUrl(), img.getAltText(), img.getDisplayOrder(), img.isPrimary()))
                    .collect(Collectors.toList()));
        }

        Double avgRating = reviewRepository.getAverageRatingForProduct(product.getId());
        response.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 4.8);
        response.setReviewCount(reviewRepository.countByProductIdAndIsApprovedTrue(product.getId()));

        return response;
    }

    private String generateSlug(String input) {
        return input.toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
}
