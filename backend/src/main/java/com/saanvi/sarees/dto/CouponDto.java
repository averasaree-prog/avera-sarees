package com.saanvi.sarees.dto;

import com.saanvi.sarees.enums.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;

public class CouponDto {

    public static class CouponResponse {
        private Long id;
        private String code;
        private String description;
        private DiscountType discountType;
        private BigDecimal discountValue;
        private BigDecimal minOrderValue;
        private BigDecimal maxDiscountAmount;
        private boolean isActive;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public DiscountType getDiscountType() { return discountType; }
        public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }
        public BigDecimal getDiscountValue() { return discountValue; }
        public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }
        public BigDecimal getMinOrderValue() { return minOrderValue; }
        public void setMinOrderValue(BigDecimal minOrderValue) { this.minOrderValue = minOrderValue; }
        public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
        public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }
        public boolean isActive() { return isActive; }
        public void setActive(boolean active) { isActive = active; }
    }

    public static class CouponCreateRequest {
        @NotBlank(message = "Coupon code is required")
        private String code;

        private String description;

        @NotNull(message = "Discount type is required")
        private DiscountType discountType;

        @NotNull(message = "Discount value is required")
        @DecimalMin(value = "0.01", message = "Discount value must be greater than zero")
        private BigDecimal discountValue;

        private BigDecimal minOrderValue = BigDecimal.ZERO;
        private BigDecimal maxDiscountAmount;
        private Instant validUntil;
        private Integer usageLimit = 1000;
        private boolean isActive = true;

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public DiscountType getDiscountType() { return discountType; }
        public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }
        public BigDecimal getDiscountValue() { return discountValue; }
        public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }
        public BigDecimal getMinOrderValue() { return minOrderValue; }
        public void setMinOrderValue(BigDecimal minOrderValue) { this.minOrderValue = minOrderValue; }
        public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
        public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }
        public Instant getValidUntil() { return validUntil; }
        public void setValidUntil(Instant validUntil) { this.validUntil = validUntil; }
        public Integer getUsageLimit() { return usageLimit; }
        public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }
        public boolean isActive() { return isActive; }
        public void setActive(boolean active) { isActive = active; }
    }
}
