package com.saanvi.sarees.dto;

public class PincodeDto {

    public static class PincodeCheckResponse {
        private String pincode;
        private boolean serviceable;
        private String estimatedDelivery;
        private boolean codAvailable;
        private String message;

        public PincodeCheckResponse() {}

        public PincodeCheckResponse(String pincode, boolean serviceable, String estimatedDelivery, boolean codAvailable, String message) {
            this.pincode = pincode;
            this.serviceable = serviceable;
            this.estimatedDelivery = estimatedDelivery;
            this.codAvailable = codAvailable;
            this.message = message;
        }

        public String getPincode() { return pincode; }
        public void setPincode(String pincode) { this.pincode = pincode; }
        public boolean isServiceable() { return serviceable; }
        public void setServiceable(boolean serviceable) { this.serviceable = serviceable; }
        public String getEstimatedDelivery() { return estimatedDelivery; }
        public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }
        public boolean isCodAvailable() { return codAvailable; }
        public void setCodAvailable(boolean codAvailable) { this.codAvailable = codAvailable; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
