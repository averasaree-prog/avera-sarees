package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.dto.PincodeDto;
import com.saanvi.sarees.service.PincodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipping")
@Tag(name = "Shipping & Logistics", description = "Endpoints for Indian PIN code delivery estimates and serviceability")
public class PincodeController {

    private final PincodeService pincodeService;

    public PincodeController(PincodeService pincodeService) {
        this.pincodeService = pincodeService;
    }

    @GetMapping("/pincode/{pincode}")
    @Operation(summary = "Check estimated delivery date and COD availability for a PIN code")
    public ResponseEntity<ApiResponse<PincodeDto.PincodeCheckResponse>> checkPincode(@PathVariable String pincode) {
        PincodeDto.PincodeCheckResponse response = pincodeService.checkServiceability(pincode);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
