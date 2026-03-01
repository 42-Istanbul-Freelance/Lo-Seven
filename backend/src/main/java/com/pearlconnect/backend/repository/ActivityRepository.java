package com.pearlconnect.backend.repository;

import com.pearlconnect.backend.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Activity> findByApproverId(Long approverId);
    List<Activity> findByStudentSchoolIdAndStatusOrderByCreatedAtAsc(Long schoolId, com.pearlconnect.backend.entity.ActivityStatus status);
    long countByStatus(com.pearlconnect.backend.entity.ActivityStatus status);
}
