package com.saanvi.sarees.dto;

import com.saanvi.sarees.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class CheckoutDto {

    public static class CheckoutSummaryRequest {
        private String couponCode;
        private Long addressId;
        private String postalCode;
        private PaymentMethod paymentMethod = PaymentMethod.RAZORPAY;

        public String getCouponCode() { return couponCode; }
        public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
        public Long getAddressId() { return addressId; }
        public void setAddressId(Long addressId) { this.addressId = addressId; }
        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
        public PaymentMethod getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public static class CheckoutSummaryResponse {
        private BigDecimal subtotal;
        private BigDecimal discountAmount;
        private BigDecimal shippingCharge;
        private BigDecimal totalAmount;
        private String appliedCouponCode;
        private String couponMessage;
        private boolean isFreeShipping;
        private BigDecimal amountNeededForFreeShipping;
        private int totalItems;
        private List<CartDto.CartItemResponse> items;

        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
        public BigDecimal getShippingCharge() { return shippingCharge; }
        public void setShippingCharge(BigDecimal shippingCharge) { this.shippingCharge = shippingCharge; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public String getAppliedCouponCode() { return appliedCouponCode; }
        public void setAppliedCouponCode(String appliedCouponCode) { this.appliedCouponCode = appliedCouponCode; }
        public String getCouponMessage() { return couponMessage; }
        public void setCouponMessage(String couponMessage) { this.couponMessage = couponMessage; }
        public boolean isFreeShipping() { return isFreeShipping; }
        public void setFreeShipping(boolean freeShipping) { isFreeShipping = freeShipping; }
        public BigDecimal getAmountNeededForFreeShipping() { return amountNeededForFreeShipping; }
        public void setAmountNeededForFreeShipping(BigDecimal amountNeededForFreeShipping) { this.amountNeededForFreeShipping = amountNeededForFreeShipping; }
        public int getTotalItems() { return totalItems; }
        public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
        public List<CartDto.CartItemResponse> getItems() { return items; }
        public void setItems(List<CartDto.CartItemResponse> items) { this.items = items; }
    }

    public static class PlaceOrderRequest {
        private Long addressId;
        private AddressDto.AddressRequest guestAddress;

        @NotBlank(message = "Customer email is required")
        private String customerEmail;

        @NotBlank(message = "Customer phone is required")
        private String customerPhone;

        private String couponCode;

        @NotNull(message = "Payment method is required")
        private PaymentMethod paymentMethod;

        private String notes;

        public Long getAddressId() { return addressId; }
        public void setAddressId(Long addressId) { this.addressId = addressId; }
        public AddressDto.AddressRequest getGuestAddress() { return guestAddress; }
        public void setGuestAddress(AddressDto.AddressRequest guestAddress) { this.guestAddress = guestAddress; }
        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
        public String getCustomerPhone() { return customerPhone; }
        public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
        public String getCouponCode() { return couponCode; }
        public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
        public PaymentMethod getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
