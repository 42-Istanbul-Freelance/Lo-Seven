"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

type CommentType = {
    id: number;
    content: string;
    authorId: number;
    authorName: string;
    createdAt: string;
};

type PostType = {
    id: number;
    content: string;
    mediaUrl: string | null;
    authorId: number;
    authorName: string;
    activityId: number | null;
    likesCount: number;
    likedByCurrentUser: boolean;
    comments: CommentType[];
    createdAt: string;
};

export default function CommunityPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostMedia, setNewPostMedia] = useState("");
    const [posting, setPosting] = useState(false);
    const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
    const [commentingId, setCommentingId] = useState<number | null>(null);

    const fetchPosts = useCallback(async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts`, {
                headers: { "Authorization": `Bearer ${session.accessToken}` },
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        } finally {
            setLoading(false);
        }
    }, [session?.accessToken]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.accessToken) {
            fetchPosts();
        }
    }, [session?.accessToken, fetchPosts]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        setPosting(true);
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({
                    content: newPostContent,
                    mediaUrl: newPostMedia || null,
                }),
            });
            if (res.ok) {
                setNewPostContent("");
                setNewPostMedia("");
                await fetchPosts();
            }
        } catch (err) {
            console.error("Failed to create post:", err);
        } finally {
            setPosting(false);
        }
    };

    const handleToggleLike = async (postId: number) => {
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts/${postId}/toggle-like`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` },
            });
            if (res.ok) {
                const updated = await res.json();
                setPosts(current => current.map(p => p.id === postId ? updated : p));
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    const handleAddComment = async (postId: number) => {
        const content = commentInputs[postId]?.trim();
        if (!content) return;
        setCommentingId(postId);
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({ content }),
            });
            if (res.ok) {
                setCommentInputs(cur => ({ ...cur, [postId]: "" }));
                await fetchPosts();
            }
        } catch (err) {
            console.error("Failed to add comment:", err);
        } finally {
            setCommentingId(null);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-20">
            <main className="w-full max-w-4xl mx-auto p-4 md:p-8">

                {/* Page Title */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-zinc-900">Social Feed</h1>
                    <Link href="/settings" className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-50 transition-colors">
                            <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Settings</span>
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="w-full bg-white rounded-[32px] shadow-[0_4px_30px_-5px_rgba(0,0,0,0.06)] border border-zinc-100/50 overflow-hidden flex flex-col min-h-[700px]">

                    {/* Top App Bar */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
                        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center border border-red-100">
                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.4H4.8L12 5.8z" /></svg>
                            </div>
                            <span className="font-bold text-sm text-zinc-900 tracking-tight">PearlConnect</span>
                        </Link>
                        <div className="flex items-center gap-5 text-zinc-600">
                            <Link href="/notifications" className="hover:text-zinc-900 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </Link>
                            <Link href="/profile" className="w-7 h-7 rounded-full bg-zinc-200 overflow-hidden border border-zinc-200 hover:ring-2 hover:ring-red-500/50 transition-all">
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-500">
                                    {session.user?.name?.charAt(0) || "U"}
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* New Post Composer */}
                    <div className="px-6 py-5 border-b border-zinc-50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 text-sm font-bold text-red-500">
                                {session.user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 space-y-3">
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share your volunteering activity..."
                                    rows={2}
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                                />
                                <div className="flex items-center gap-3">
                                    <input
                                        type="url"
                                        value={newPostMedia}
                                        onChange={(e) => setNewPostMedia(e.target.value)}
                                        placeholder="Image URL (optional)"
                                        className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                    />
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={posting || !newPostContent.trim()}
                                        className="bg-red-500 hover:bg-red-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                                    >
                                        {posting ? "..." : "Post"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="flex-1 overflow-y-auto">
                        {posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                <p className="font-semibold">No posts yet</p>
                                <p className="text-sm mt-1">Be the first to share your experience!</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="px-6 py-5 border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        {/* Author Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-sm font-bold text-zinc-500 ring-2 ring-zinc-50">
                                            {post.authorName?.charAt(0) || "U"}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* Author Name + Time */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-zinc-800">{post.authorName}</span>
                                                <span className="text-[11px] text-zinc-400">
                                                    {new Date(post.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <p className="text-sm text-zinc-700 mb-3 leading-relaxed">{post.content}</p>

                                            {/* Media */}
                                            {post.mediaUrl && (
                                                <div className="w-full max-w-md rounded-2xl overflow-hidden mb-3 border border-zinc-100">
                                                    <img src={post.mediaUrl} alt="Post media" className="w-full h-48 object-cover" />
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-6 mt-1">
                                                <button
                                                    onClick={() => handleToggleLike(post.id)}
                                                    className="flex items-center gap-1.5 group"
                                                >
                                                    <svg
                                                        className={`w-4 h-4 transition-colors ${post.likedByCurrentUser ? "text-red-500 fill-red-500" : "text-zinc-400 group-hover:text-red-400"}`}
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    <span className={`text-xs font-bold ${post.likedByCurrentUser ? "text-red-500" : "text-zinc-500"}`}>
                                                        {post.likesCount}
                                                    </span>
                                                </button>

                                                <span className="flex items-center gap-1.5 text-zinc-400">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    <span className="text-xs font-bold">{post.comments?.length || 0}</span>
                                                </span>
                                            </div>

                                            {/* Comments */}
                                            {post.comments && post.comments.length > 0 && (
                                                <div className="mt-3 space-y-2 pl-2 border-l-2 border-zinc-100">
                                                    {post.comments.map((comment) => (
                                                        <div key={comment.id} className="text-xs text-zinc-600">
                                                            <span className="font-bold text-zinc-800">{comment.authorName}</span>{" "}
                                                            {comment.content}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add Comment */}
                                            <div className="flex items-center gap-2 mt-3">
                                                <input
                                                    type="text"
                                                    value={commentInputs[post.id] || ""}
                                                    onChange={(e) => setCommentInputs(cur => ({ ...cur, [post.id]: e.target.value }))}
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(post.id); }}
                                                    placeholder="Write a comment..."
                                                    className="flex-1 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500/20"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post.id)}
                                                    disabled={commentingId === post.id}
                                                    className="text-red-500 hover:text-red-600 font-bold text-xs transition-colors"
                                                >
                                                    {commentingId === post.id ? "..." : "Send"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
