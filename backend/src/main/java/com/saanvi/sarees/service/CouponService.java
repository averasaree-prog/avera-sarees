package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.CouponDto;
import com.saanvi.sarees.entity.Coupon;
import com.saanvi.sarees.enums.DiscountType;
import com.saanvi.sarees.exception.BadRequestException;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public Coupon findValidCoupon(String code, BigDecimal subtotal) {
        if (code == null || code.isBlank()) {
            return null;
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(code.trim())
                .orElseThrow(() -> new BadRequestException("Invalid or inactive coupon code: " + code));

        if (coupon.getValidUntil() != null && coupon.getValidUntil().isBefore(Instant.now())) {
            throw new BadRequestException("Coupon code " + code + " has expired.");
        }

        if (coupon.getUsageLimit() != null && coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            throw new BadRequestException("Coupon code " + code + " has reached its maximum usage limit.");
        }

        if (coupon.getMinOrderValue() != null && subtotal.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new BadRequestException("Minimum order value of ₹" + coupon.getMinOrderValue() + " required to use coupon " + code);
        }

        return coupon;
    }

    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        if (coupon == null || subtotal == null || subtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(coupon.getDiscountValue()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else {
            discount = coupon.getDiscountValue();
        }

        return discount.min(subtotal);
    }

    public List<CouponDto.CouponResponse> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToCouponResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CouponDto.CouponResponse createCoupon(CouponDto.CouponCreateRequest request) {
        if (couponRepository.existsByCodeIgnoreCase(request.getCode().trim())) {
            throw new BadRequestException("A coupon with code '" + request.getCode() + "' already exists.");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(request.getCode().trim().toUpperCase());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderValue(request.getMinOrderValue() != null ? request.getMinOrderValue() : BigDecimal.ZERO);
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setActive(request.isActive());

        return mapToCouponResponse(couponRepository.save(coupon));
    }

    @Transactional
    public CouponDto.CouponResponse updateCoupon(Long id, CouponDto.CouponCreateRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        String newCode = request.getCode().trim().toUpperCase();
        if (!coupon.getCode().equalsIgnoreCase(newCode) && couponRepository.existsByCodeIgnoreCase(newCode)) {
            throw new BadRequestException("A coupon with code '" + newCode + "' already exists.");
        }

        coupon.setCode(newCode);
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderValue(request.getMinOrderValue() != null ? request.getMinOrderValue() : BigDecimal.ZERO);
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setActive(request.isActive());

        return mapToCouponResponse(couponRepository.save(coupon));
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        couponRepository.delete(coupon);
    }

    public CouponDto.CouponResponse mapToCouponResponse(Coupon coupon) {
        CouponDto.CouponResponse response = new CouponDto.CouponResponse();
        response.setId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setDescription(coupon.getDescription());
        response.setDiscountType(coupon.getDiscountType());
        response.setDiscountValue(coupon.getDiscountValue());
        response.setMinOrderValue(coupon.getMinOrderValue());
        response.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
        response.setActive(coupon.isActive());
        return response;
    }
}
