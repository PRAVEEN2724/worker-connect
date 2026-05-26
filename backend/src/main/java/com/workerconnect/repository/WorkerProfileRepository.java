package com.workerconnect.repository;

import com.workerconnect.model.WorkerProfile;
import com.workerconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
    Optional<WorkerProfile> findByUser(User user);
    Optional<WorkerProfile> findByUserId(Long userId);

    @Query("SELECT w FROM WorkerProfile w WHERE " +
           "(COALESCE(:city, '') = '' OR LOWER(w.user.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(COALESCE(:pincode, '') = '' OR w.user.pincode = :pincode) AND " +
           "(COALESCE(:category, '') = '' OR LOWER(w.category) LIKE LOWER(CONCAT('%', :category, '%')))")
    List<WorkerProfile> searchWorkers(@Param("city") String city,
                                      @Param("pincode") String pincode,
                                      @Param("category") String category);
}
