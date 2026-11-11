package com.saanvi.sarees;

import com.saanvi.sarees.dto.PincodeDto;
import com.saanvi.sarees.service.PincodeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PincodeServiceTest {

    private PincodeService pincodeService;

    @BeforeEach
    void setUp() {
        pincodeService = new PincodeService();
    }

    @Test
    @DisplayName("Valid Indian metro PIN code should be serviceable with COD enabled")
    void testValidMetroPincode() {
        PincodeDto.PincodeCheckResponse response = pincodeService.checkServiceability("110001");
        assertTrue(response.isServiceable());
        assertTrue(response.isCodAvailable());
        assertNotNull(response.getEstimatedDelivery());
    }

    @Test
    @DisplayName("Invalid PIN code format should return non-serviceable error message")
    void testInvalidPincodeFormat() {
        PincodeDto.PincodeCheckResponse response = pincodeService.checkServiceability("123");
        assertFalse(response.isServiceable());
        assertFalse(response.isCodAvailable());
    }
}
