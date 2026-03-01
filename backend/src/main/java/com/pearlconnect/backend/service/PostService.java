package com.pearlconnect.backend.service;

import com.pearlconnect.backend.dto.CommentRequest;
import com.pearlconnect.backend.dto.CommentResponse;
import com.pearlconnect.backend.dto.PostRequest;
import com.pearlconnect.backend.dto.PostResponse;
import com.pearlconnect.backend.entity.*;
import com.pearlconnect.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final GamificationService gamificationService;
    private final NotificationService notificationService;

    public PostResponse createPost(PostRequest request, Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Activity linkedActivity = null;
        if (request.getActivityId() != null) {
            linkedActivity = activityRepository.findById(request.getActivityId()).orElse(null);
        }

        Post post = Post.builder()
                .content(request.getContent())
                .mediaUrl(request.getMediaUrl())
                .author(author)
                .activity(linkedActivity)
                .likesCount(0)
                .build();

        Post savedPost = postRepository.save(post);
        
        // Award points for creating a post
        gamificationService.awardPointsForPost(userId);
        
        return mapToPostResponse(savedPost, userId);
    }

    public List<PostResponse> getAllPosts(Long currentUserId) {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(post -> mapToPostResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    public CommentResponse addComment(Long postId, Long userId, CommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .user(author)
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Notify post author about the comment
        if (!post.getAuthor().getId().equals(userId)) {
            String actorName = author.getFirstName() + " " + author.getLastName();
            notificationService.createNotification(
                    post.getAuthor().getId(),
                    "COMMENT",
                    actorName + " commented on your post",
                    actorName,
                    postId
            );
        }

        return mapToCommentResponse(savedComment);
    }

    public PostResponse toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyLiked = postLikeRepository.existsByPostIdAndUserId(postId, userId);

        if (alreadyLiked) {
            PostLike like = postLikeRepository.findByPostIdAndUserId(postId, userId).orElseThrow();
            postLikeRepository.delete(like);
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        } else {
            PostLike newLike = PostLike.builder().post(post).user(user).build();
            postLikeRepository.save(newLike);
            post.setLikesCount(post.getLikesCount() + 1);
            
            // Award point to the author of the post
            if (!post.getAuthor().getId().equals(userId)) {
                gamificationService.awardPointsForLike(post.getAuthor().getId());
                String actorName = user.getFirstName() + " " + user.getLastName();
                notificationService.createNotification(
                        post.getAuthor().getId(),
                        "LIKE",
                        actorName + " liked your post",
                        actorName,
                        postId
                );
            }
        }

        postRepository.save(post);
        return mapToPostResponse(post, userId);
    }

    private PostResponse mapToPostResponse(Post post, Long currentUserId) {
        boolean isLiked = false;
        if (currentUserId != null) {
            isLiked = postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);
        }

        List<CommentResponse> commentResponses = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId())
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName())
                .activityId(post.getActivity() != null ? post.getActivity().getId() : null)
                .likesCount(post.getLikesCount())
                .isLikedByCurrentUser(isLiked)
                .comments(commentResponses)
                .createdAt(post.getCreatedAt())
                .build();
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorId(comment.getUser().getId())
                .authorName(comment.getUser().getFirstName() + " " + comment.getUser().getLastName())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
