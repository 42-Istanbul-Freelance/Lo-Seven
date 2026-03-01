package com.pearlconnect.backend.repository;

import com.pearlconnect.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}
