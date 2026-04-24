package com.workerconnect.service;

import com.workerconnect.model.*;
import com.workerconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public Booking createBooking(Long customerId, Long workerId, Booking bookingData) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        Booking booking = Booking.builder()
                .customer(customer)
                .worker(worker)
                .workDescription(bookingData.getWorkDescription())
                .bookingDate(bookingData.getBookingDate())
                .address(bookingData.getAddress())
                .status(Booking.Status.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> getWorkerBookings(Long workerId) {
        return bookingRepository.findByWorkerIdOrderByCreatedAtDesc(workerId);
    }

    public Booking updateBookingStatus(Long bookingId, Booking.Status status, Long workerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getWorker().getId().equals(workerId)) {
            throw new RuntimeException("Unauthorized: You can only update your own bookings");
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
