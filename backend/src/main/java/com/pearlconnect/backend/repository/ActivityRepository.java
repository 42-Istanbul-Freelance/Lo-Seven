package com.pearlconnect.backend.repository;

import com.pearlconnect.backend.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Activity> findByApproverId(Long approverId);

    List<Activity> findByStudentSchoolIdAndStatusOrderByCreatedAtAsc(Long schoolId,
            com.pearlconnect.backend.entity.ActivityStatus status);

    long countByStatus(com.pearlconnect.backend.entity.ActivityStatus status);

    @Query("SELECT coalesce(SUM(a.hours), 0) FROM Activity a WHERE a.student.school.id = :schoolId AND a.status = :status")
    Long getSumOfApprovedHoursBySchoolId(@Param("schoolId") Long schoolId,
            @Param("status") com.pearlconnect.backend.entity.ActivityStatus status);
}
