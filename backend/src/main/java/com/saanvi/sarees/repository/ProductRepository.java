package com.saanvi.sarees.repository;

import com.saanvi.sarees.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlugAndIsActiveTrue(String slug);
    Optional<Product> findBySku(String sku);

    List<Product> findTop8ByIsActiveTrueAndIsFeaturedTrueOrderByCreatedAtDesc();
    List<Product> findTop8ByIsActiveTrueAndIsBestSellerTrueOrderByCreatedAtDesc();
    List<Product> findTop8ByIsActiveTrueAndIsNewArrivalTrueOrderByCreatedAtDesc();

    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
           "AND (:categorySlug IS NULL OR LOWER(p.category.slug) = LOWER(:categorySlug)) " +
           "AND (:fabric IS NULL OR LOWER(p.fabric) = LOWER(:fabric)) " +
           "AND (:occasion IS NULL OR LOWER(p.occasion) = LOWER(:occasion)) " +
           "AND (:color IS NULL OR LOWER(p.color) = LOWER(:color)) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:inStockOnly = false OR p.stockQuantity > 0) " +
           "AND (:searchQuery IS NULL OR " +
           "     LOWER(p.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
           "     LOWER(p.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
           "     LOWER(p.fabric) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
           "     LOWER(p.color) LIKE LOWER(CONCAT('%', :searchQuery, '%')))")
    Page<Product> filterProducts(
        @Param("categorySlug") String categorySlug,
        @Param("fabric") String fabric,
        @Param("occasion") String occasion,
        @Param("color") String color,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("inStockOnly") boolean inStockOnly,
        @Param("searchQuery") String searchQuery,
        Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category.id = :categoryId AND p.id != :excludeProductId ORDER BY p.isBestSeller DESC, p.createdAt DESC")
    List<Product> findRelatedProducts(@Param("categoryId") Long categoryId, @Param("excludeProductId") Long excludeProductId, Pageable pageable);

    @Query("SELECT DISTINCT p.fabric FROM Product p WHERE p.isActive = true ORDER BY p.fabric ASC")
    List<String> findDistinctFabrics();

    @Query("SELECT DISTINCT p.color FROM Product p WHERE p.isActive = true ORDER BY p.color ASC")
    List<String> findDistinctColors();

    @Query("SELECT DISTINCT p.occasion FROM Product p WHERE p.isActive = true ORDER BY p.occasion ASC")
    List<String> findDistinctOccasions();

    long countByStockQuantityLessThan(int threshold);
}
