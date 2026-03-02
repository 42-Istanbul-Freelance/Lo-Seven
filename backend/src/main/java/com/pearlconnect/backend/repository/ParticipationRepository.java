package com.pearlconnect.backend.repository;

import com.pearlconnect.backend.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByActivityId(Long activityId);

    List<Participation> findByStudentId(Long studentId);

    Optional<Participation> findByActivityIdAndStudentId(Long activityId, Long studentId);
}
