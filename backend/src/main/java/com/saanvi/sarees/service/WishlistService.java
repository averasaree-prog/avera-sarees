package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.WishlistDto;
import com.saanvi.sarees.entity.Product;
import com.saanvi.sarees.entity.User;
import com.saanvi.sarees.entity.Wishlist;
import com.saanvi.sarees.entity.WishlistItem;
import com.saanvi.sarees.exception.BadRequestException;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.ProductRepository;
import com.saanvi.sarees.repository.WishlistItemRepository;
import com.saanvi.sarees.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    public WishlistService(WishlistRepository wishlistRepository,
                           WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository,
                           AuthService authService) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.authService = authService;
    }

    @Transactional
    public Wishlist getOrCreateWishlist() {
        User user = authService.getAuthenticatedUser();
        if (user == null) {
            throw new BadRequestException("Please sign in to manage your wishlist.");
        }

        return wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> wishlistRepository.save(new Wishlist(user)));
    }

    @Transactional(readOnly = true)
    public WishlistDto.WishlistResponse getWishlist() {
        Wishlist wishlist = getOrCreateWishlist();
        return mapToWishlistResponse(wishlist);
    }

    @Transactional
    public WishlistDto.WishlistResponse toggleWishlist(Long productId) {
        Wishlist wishlist = getOrCreateWishlist();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Optional<WishlistItem> existing = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), product.getId());

        if (existing.isPresent()) {
            wishlist.getItems().remove(existing.get());
            wishlistItemRepository.delete(existing.get());
        } else {
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlist.getItems().add(item);
            wishlistItemRepository.save(item);
        }

        return mapToWishlistResponse(wishlistRepository.findById(wishlist.getId()).orElse(wishlist));
    }

    private WishlistDto.WishlistResponse mapToWishlistResponse(Wishlist wishlist) {
        List<WishlistDto.WishlistItemResponse> items = new ArrayList<>();

        for (WishlistItem item : wishlist.getItems()) {
            Product product = item.getProduct();
            WishlistDto.WishlistItemResponse resp = new WishlistDto.WishlistItemResponse();
            resp.setId(item.getId());
            resp.setProductId(product.getId());
            resp.setName(product.getName());
            resp.setSlug(product.getSlug());
            resp.setSku(product.getSku());
            resp.setPrice(product.getPrice());
            resp.setOriginalPrice(product.getOriginalPrice());
            resp.setInStock(product.getStockQuantity() != null && product.getStockQuantity() > 0);

            if (product.getImages() != null && !product.getImages().isEmpty()) {
                resp.setPrimaryImage(product.getImages().get(0).getImageUrl());
            }

            items.add(resp);
        }

        return new WishlistDto.WishlistResponse(wishlist.getId(), items);
    }
}
