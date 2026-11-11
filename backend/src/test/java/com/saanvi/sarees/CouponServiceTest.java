package com.saanvi.sarees;

import com.saanvi.sarees.entity.Coupon;
import com.saanvi.sarees.enums.DiscountType;
import com.saanvi.sarees.exception.BadRequestException;
import com.saanvi.sarees.repository.CouponRepository;
import com.saanvi.sarees.service.CouponService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private CouponService couponService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Percentage coupon should calculate correct discount within cap")
    void testPercentageCouponWithCap() {
        Coupon coupon = new Coupon();
        coupon.setCode("UTSAV10");
        coupon.setDiscountType(DiscountType.PERCENTAGE);
        coupon.setDiscountValue(new BigDecimal("10.00")); // 10%
        coupon.setMinOrderValue(new BigDecimal("2000.00"));
        coupon.setMaxDiscountAmount(new BigDecimal("500.00"));
        coupon.setActive(true);

        when(couponRepository.findByCodeIgnoreCaseAndIsActiveTrue("UTSAV10")).thenReturn(Optional.of(coupon));

        // Subtotal = 10,000 -> 10% is 1,000 -> Capped at 500
        BigDecimal discount = couponService.calculateDiscount(coupon, new BigDecimal("10000.00"));
        assertEquals(new BigDecimal("500.00"), discount);
    }

    @Test
    @DisplayName("Subtotal below minimum order value should throw BadRequestException")
    void testMinOrderValueRequirement() {
        Coupon coupon = new Coupon();
        coupon.setCode("UTSAV10");
        coupon.setMinOrderValue(new BigDecimal("3000.00"));
        coupon.setActive(true);

        when(couponRepository.findByCodeIgnoreCaseAndIsActiveTrue("UTSAV10")).thenReturn(Optional.of(coupon));

        assertThrows(BadRequestException.class, () -> {
            couponService.findValidCoupon("UTSAV10", new BigDecimal("1500.00"));
        });
    }
}
