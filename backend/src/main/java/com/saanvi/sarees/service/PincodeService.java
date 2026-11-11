package com.saanvi.sarees.service;

import com.saanvi.sarees.dto.PincodeDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

@Service
public class PincodeService {

    private static final Pattern PINCODE_PATTERN = Pattern.compile("^[1-9][0-9]{5}$");

    public PincodeDto.PincodeCheckResponse checkServiceability(String pincode) {
        if (pincode == null || !PINCODE_PATTERN.matcher(pincode.trim()).matches()) {
            return new PincodeDto.PincodeCheckResponse(
                    pincode,
                    false,
                    null,
                    false,
                    "Please enter a valid 6-digit Indian PIN code."
            );
        }

        String cleanPin = pincode.trim();
        char firstDigit = cleanPin.charAt(0);

        // Indian PIN Code structure:
        // 1: Delhi, Haryana, Punjab, Himachal Pradesh, J&K, Chandigarh
        // 2: UP, Uttarakhand
        // 3: Rajasthan, Gujarat
        // 4: Maharashtra, Goa, MP, Chhattisgarh
        // 5: AP, Telangana, Karnataka
        // 6: Tamil Nadu, Kerala, Pondicherry, Lakshadweep
        // 7: West Bengal, Odisha, North East
        // 8: Bihar, Jharkhand

        int transitDays;
        boolean codAllowed = true;

        if (cleanPin.startsWith("110") || cleanPin.startsWith("400") || cleanPin.startsWith("560") ||
            cleanPin.startsWith("600") || cleanPin.startsWith("500") || cleanPin.startsWith("700")) {
            // Tier-1 Metros (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata)
            transitDays = 2;
        } else if (firstDigit == '7' || firstDigit == '1') {
            transitDays = 5;
        } else {
            transitDays = 3;
        }

        LocalDate deliveryDate = LocalDate.now().plusDays(transitDays);
        String formattedDate = deliveryDate.format(DateTimeFormatter.ofPattern("EEEE, MMM dd"));

        return new PincodeDto.PincodeCheckResponse(
                cleanPin,
                true,
                formattedDate,
                codAllowed,
                "Delivery by " + formattedDate + " | Cash on Delivery Available"
        );
    }
}
