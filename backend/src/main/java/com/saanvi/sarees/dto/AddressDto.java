package com.saanvi.sarees.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AddressDto {

    public static class AddressRequest {
        @NotBlank(message = "Recipient name is required")
        private String recipientName;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9+ -]{10,15}$", message = "Please provide a valid 10-digit phone number")
        private String phone;

        @NotBlank(message = "Address line 1 is required")
        private String addressLine1;

        private String addressLine2;
        private String landmark;

        @NotBlank(message = "City is required")
        private String city;

        @NotBlank(message = "State is required")
        private String state;

        @NotBlank(message = "Postal code is required")
        @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Please enter a valid 6-digit Indian PIN code")
        private String postalCode;

        private String addressType = "HOME";
        private boolean isDefault = false;

        public String getRecipientName() { return recipientName; }
        public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddressLine1() { return addressLine1; }
        public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

        public String getAddressLine2() { return addressLine2; }
        public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

        public String getLandmark() { return landmark; }
        public void setLandmark(String landmark) { this.landmark = landmark; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

        public String getAddressType() { return addressType; }
        public void setAddressType(String addressType) { this.addressType = addressType; }

        public boolean isDefault() { return isDefault; }
        public void setDefault(boolean aDefault) { isDefault = aDefault; }
    }

    public static class AddressResponse {
        private Long id;
        private String recipientName;
        private String phone;
        private String addressLine1;
        private String addressLine2;
        private String landmark;
        private String city;
        private String state;
        private String postalCode;
        private String addressType;
        private boolean isDefault;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getRecipientName() { return recipientName; }
        public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddressLine1() { return addressLine1; }
        public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

        public String getAddressLine2() { return addressLine2; }
        public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

        public String getLandmark() { return landmark; }
        public void setLandmark(String landmark) { this.landmark = landmark; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

        public String getAddressType() { return addressType; }
        public void setAddressType(String addressType) { this.addressType = addressType; }

        public boolean isDefault() { return isDefault; }
        public void setDefault(boolean aDefault) { isDefault = aDefault; }
    }
}
