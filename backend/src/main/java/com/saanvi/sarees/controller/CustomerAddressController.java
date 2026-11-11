package com.saanvi.sarees.controller;

import com.saanvi.sarees.dto.AddressDto;
import com.saanvi.sarees.dto.ApiResponse;
import com.saanvi.sarees.entity.Address;
import com.saanvi.sarees.entity.User;
import com.saanvi.sarees.exception.BadRequestException;
import com.saanvi.sarees.exception.ResourceNotFoundException;
import com.saanvi.sarees.repository.AddressRepository;
import com.saanvi.sarees.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/addresses")
@Tag(name = "Customer Addresses", description = "Endpoints for managing saved customer delivery addresses")
public class CustomerAddressController {

    private final AddressRepository addressRepository;
    private final AuthService authService;

    public CustomerAddressController(AddressRepository addressRepository, AuthService authService) {
        this.addressRepository = addressRepository;
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "Get all saved addresses for authenticated customer")
    public ResponseEntity<ApiResponse<List<AddressDto.AddressResponse>>> getAddresses() {
        User user = authService.getAuthenticatedUser();
        if (user == null) throw new BadRequestException("Must be authenticated");

        List<AddressDto.AddressResponse> responses = addressRepository
                .findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping
    @Transactional
    @Operation(summary = "Save a new delivery address")
    public ResponseEntity<ApiResponse<AddressDto.AddressResponse>> createAddress(@Valid @RequestBody AddressDto.AddressRequest request) {
        User user = authService.getAuthenticatedUser();
        if (user == null) throw new BadRequestException("Must be authenticated");

        if (request.isDefault()) {
            addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                    .forEach(addr -> {
                        addr.setDefault(false);
                        addressRepository.save(addr);
                    });
        }

        Address address = new Address();
        address.setUser(user);
        address.setRecipientName(request.getRecipientName().trim());
        address.setPhone(request.getPhone().trim());
        address.setAddressLine1(request.getAddressLine1().trim());
        address.setAddressLine2(request.getAddressLine2());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPostalCode(request.getPostalCode().trim());
        address.setAddressType(request.getAddressType());
        address.setDefault(request.isDefault());

        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.success(mapToResponse(saved), "Address saved successfully."));
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Delete a saved delivery address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        if (user == null) throw new BadRequestException("Must be authenticated");

        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        addressRepository.delete(address);
        return ResponseEntity.ok(ApiResponse.success(null, "Address removed successfully."));
    }

    private AddressDto.AddressResponse mapToResponse(Address a) {
        AddressDto.AddressResponse r = new AddressDto.AddressResponse();
        r.setId(a.getId());
        r.setRecipientName(a.getRecipientName());
        r.setPhone(a.getPhone());
        r.setAddressLine1(a.getAddressLine1());
        r.setAddressLine2(a.getAddressLine2());
        r.setLandmark(a.getLandmark());
        r.setCity(a.getCity());
        r.setState(a.getState());
        r.setPostalCode(a.getPostalCode());
        r.setAddressType(a.getAddressType());
        r.setDefault(a.isDefault());
        return r;
    }
}
