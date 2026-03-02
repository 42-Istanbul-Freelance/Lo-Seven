package com.pearlconnect.backend.repository;

import com.pearlconnect.backend.entity.User;
import com.pearlconnect.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Long countBySchoolIdAndRole(Long schoolId, Role role);

    java.util.List<User> findBySchoolIdAndRole(Long schoolId, Role role);

    java.util.List<User> findByRole(Role role);

    @Query("SELECT coalesce(SUM(u.points), 0) FROM User u WHERE u.school.id = :schoolId")
    Long getSumOfPointsBySchoolId(@Param("schoolId") Long schoolId);
}
