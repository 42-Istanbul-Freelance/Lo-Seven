"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HeartIcon, ChatBubbleLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { getApiUrl } from "@/lib/api";

interface Comment {
    id: number;
    content: string;
    authorName: string;
    createdAt: string;
}

interface Post {
    id: number;
    content: string;
    mediaUrl?: string;
    authorName: string;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    comments: Comment[];
    createdAt: string;
}

export default function FeedPage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostMedia, setNewPostMedia] = useState("");
    const [commentingOn, setCommentingOn] = useState<number | null>(null);
    const [commentContent, setCommentContent] = useState("");

    const fetchPosts = async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts`, {
                headers: { "Authorization": `Bearer ${session.accessToken}` }
            });
            if (res.ok) setPosts(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [session]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify({ content: newPostContent, mediaUrl: newPostMedia })
            });

            if (res.ok) {
                setNewPostContent("");
                setNewPostMedia("");
                fetchPosts(); // Refresh feed
            }
        } catch (e) { console.error(e); }
    };

    const handleToggleLike = async (postId: number) => {
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts/${postId}/toggle-like`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session?.accessToken}` }
            });
            if (res.ok) fetchPosts();
        } catch (e) { console.error(e); }
    };

    const handleAddComment = async (postId: number) => {
        if (!commentContent.trim()) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify({ content: commentContent })
            });
            if (res.ok) {
                setCommentContent("");
                setCommentingOn(null);
                fetchPosts();
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen">
            <h1 className="text-3xl font-bold font-mono text-white mb-8 border-b border-zinc-900 pb-4">
                [Sosyal_Akış]
            </h1>

            {/* Create Post Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-8">
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <textarea
                        placeholder="Neler paylaşıyorsun?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded p-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Görsel URL (İsteğe bağlı)"
                            value={newPostMedia}
                            onChange={(e) => setNewPostMedia(e.target.value)}
                            className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={!newPostContent.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded font-mono font-bold text-sm transition-colors disabled:opacity-50"
                        >
                            PAYLAŞ
                        </button>
                    </div>
                </form>
            </div>

            {/* Feed Stream */}
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-zinc-800/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white font-mono">
                                    {post.authorName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-zinc-200 font-mono text-sm">{post.authorName}</div>
                                    <div className="text-xs text-zinc-500">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</div>
                                </div>
                            </div>
                            <p className="text-zinc-300 font-mono text-sm mb-3">
                                {post.content}
                            </p>
                            {post.mediaUrl && (
                                <div className="mt-3 rounded-md overflow-hidden bg-black max-h-96 flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={post.mediaUrl} alt="Post media" className="max-w-full max-h-96 object-contain" />
                                </div>
                            )}
                        </div>

                        {/* Interaction Bar */}
                        <div className="px-4 py-3 flex items-center gap-6 bg-zinc-950/30">
                            <button
                                onClick={() => handleToggleLike(post.id)}
                                className="flex items-center gap-2 group transition-colors"
                            >
                                {post.isLikedByCurrentUser
                                    ? <HeartSolidIcon className="w-6 h-6 text-red-500 group-hover:text-red-400" />
                                    : <HeartIcon className="w-6 h-6 text-zinc-400 group-hover:text-red-400" />
                                }
                                <span className={`font-mono text-sm ${post.isLikedByCurrentUser ? 'text-red-500' : 'text-zinc-400'}`}>
                                    {post.likesCount}
                                </span>
                            </button>

                            <button
                                onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                                className="flex items-center gap-2 text-zinc-400 hover:text-indigo-400 transition-colors group"
                            >
                                <ChatBubbleLeftIcon className="w-6 h-6 group-hover:fill-indigo-400/20" />
                                <span className="font-mono text-sm">{post.comments.length}</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        {(post.comments.length > 0 || commentingOn === post.id) && (
                            <div className="px-4 py-3 bg-zinc-950/50 border-t border-zinc-800/50">
                                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
                                    {post.comments.map(c => (
                                        <div key={c.id} className="flex gap-2 text-sm font-mono">
                                            <span className="font-bold text-indigo-400">{c.authorName}:</span>
                                            <span className="text-zinc-300">{c.content}</span>
                                        </div>
                                    ))}
                                </div>

                                {commentingOn === post.id && (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Yorum yaz..."
                                            value={commentContent}
                                            onChange={e => setCommentContent(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id) }}
                                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <button
                                            onClick={() => handleAddComment(post.id)}
                                            disabled={!commentContent.trim()}
                                            className="text-indigo-500 hover:text-indigo-400 disabled:opacity-50"
                                        >
                                            <PaperAirplaneIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="text-center text-zinc-600 font-mono py-12 border border-zinc-800/50 border-dashed rounded-lg">
                        Henüz paylaşım yok. İlk paylaşan sen ol!
                    </div>
                )}
            </div>
        </div>
    );
}
