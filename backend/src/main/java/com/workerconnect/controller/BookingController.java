package com.workerconnect.controller;

import com.workerconnect.model.Booking;
import com.workerconnect.repository.UserRepository;
import com.workerconnect.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping("/worker/{workerId}")
    public ResponseEntity<Booking> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long workerId,
            @RequestBody Booking bookingData) {
        Long customerId = getUserId(userDetails);
        return ResponseEntity.ok(bookingService.createBooking(customerId, workerId, bookingData));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(bookingService.getCustomerBookings(userId));
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<Booking>> getIncomingBookings(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(bookingService.getWorkerBookings(userId));
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> body) {
        Long workerId = getUserId(userDetails);
        Booking.Status status = Booking.Status.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status, workerId));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
