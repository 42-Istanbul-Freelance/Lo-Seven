package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.dto.CommentRequest;
import com.pearlconnect.backend.dto.CommentResponse;
import com.pearlconnect.backend.dto.PostRequest;
import com.pearlconnect.backend.dto.PostResponse;
import com.pearlconnect.backend.security.CustomUserDetails;
import com.pearlconnect.backend.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getFeed(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(postService.getAllPosts(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(postService.createPost(request, userDetails.getId()));
    }

    @PostMapping("/{postId}/toggle-like")
    public ResponseEntity<PostResponse> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(postService.toggleLike(postId, userDetails.getId()));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(postService.addComment(postId, userDetails.getId(), request));
    }
}
