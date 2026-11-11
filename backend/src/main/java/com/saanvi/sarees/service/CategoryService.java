package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.ProductDto;
import com.saanvi.sarees.entity.Category;
import com.saanvi.sarees.exception.BadRequestException;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<ProductDto.CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    public List<ProductDto.CategoryResponse> getAllCategoriesForAdmin() {
        return categoryRepository.findAll().stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    public ProductDto.CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return mapToCategoryResponse(category);
    }

    @Transactional
    public ProductDto.CategoryResponse createCategory(ProductDto.CategoryRequest request) {
        String slug = generateSlug(request.getName());
        if (categoryRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis() % 1000;
        }

        Category category = new Category(
                request.getName().trim(),
                slug,
                request.getDescription(),
                request.getImageUrl(),
                request.getDisplayOrder()
        );
        category.setActive(request.isActive());

        Category saved = categoryRepository.save(category);
        return mapToCategoryResponse(saved);
    }

    @Transactional
    public ProductDto.CategoryResponse updateCategory(Long id, ProductDto.CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        category.setDisplayOrder(request.getDisplayOrder());
        category.setActive(request.isActive());

        return mapToCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        try {
            categoryRepository.delete(category);
            categoryRepository.flush();
        } catch (Exception e) {
            // If sarees are currently linked to this category, soft deactivate it
            category.setActive(false);
            categoryRepository.save(category);
        }
    }

    public ProductDto.CategoryResponse mapToCategoryResponse(Category category) {
        return new ProductDto.CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                category.getDisplayOrder(),
                category.isActive()
        );
    }

    private String generateSlug(String input) {
        return input.toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
}
