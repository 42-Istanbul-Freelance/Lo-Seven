"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
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
    mediaUrl: string | null;
    authorName: string;
    likesCount: number;
    likedByCurrentUser: boolean;
    comments: Comment[];
    createdAt: string;
}

export default function FeedPage() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") fetchPosts();
    }, [status]);

    const fetchPosts = async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts`, {
                headers: { "Authorization": `Bearer ${session.accessToken}` }
            });
            if (res.ok) setPosts(await res.json());
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const createPost = async () => {
        if (!newPostContent.trim() || !session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`
                },
                body: JSON.stringify({ content: newPostContent })
            });
            if (res.ok) {
                setNewPostContent("");
                fetchPosts();
            }
        } catch (e) { console.error(e); }
    };

    const toggleLike = async (postId: number) => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts/${postId}/toggle-like`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${session.accessToken}` }
            });
            if (res.ok) {
                const updated = await res.json();
                setPosts(posts.map(p => p.id === postId ? updated : p));
            }
        } catch (e) { console.error(e); }
    };

    const addComment = async (postId: number) => {
        const text = commentTexts[postId];
        if (!text?.trim() || !session?.accessToken) return;
        try {
            const res = await fetch(`${getApiUrl()}/api/v1/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`
                },
                body: JSON.stringify({ content: text })
            });
            if (res.ok) {
                setCommentTexts({ ...commentTexts, [postId]: "" });
                fetchPosts();
            }
        } catch (e) { console.error(e); }
    };

    if (isLoading || status === "loading") {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="font-mono text-zinc-400">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-6">
                <h1 className="text-2xl font-bold font-mono text-zinc-900">[Sosyal_Akış]</h1>
                <Link href="/dashboard" className="text-sm font-mono text-zinc-500 hover:text-indigo-600 transition-colors">← Dashboard</Link>
            </div>

            {/* New Post */}
            <div className="bg-white border border-zinc-200 rounded-lg p-5 mb-8 shadow-sm">
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Ne düşünüyorsun? Bir gönüllülük hikayesi paylaş..."
                    rows={3}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md p-3 text-zinc-800 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
                <div className="flex justify-end mt-3">
                    <button
                        onClick={createPost}
                        disabled={!newPostContent.trim()}
                        className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors font-mono disabled:opacity-50"
                    >
                        PAYLAŞ
                    </button>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-lg">
                        <p className="font-mono text-zinc-400 text-sm">Henüz bir paylaşım yok. İlk sen paylaş!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold font-mono text-sm">
                                    {post.authorName?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="font-mono text-sm font-bold text-zinc-800">{post.authorName}</p>
                                    <p className="font-mono text-xs text-zinc-400">{new Date(post.createdAt).toLocaleDateString("tr-TR")}</p>
                                </div>
                            </div>

                            <p className="text-zinc-700 text-sm mb-4 leading-relaxed">{post.content}</p>

                            {post.mediaUrl && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={post.mediaUrl} alt="Post media" className="rounded-md mb-4 max-h-64 object-cover w-full" />
                            )}

                            <div className="flex items-center gap-4 border-t border-zinc-100 pt-3">
                                <button
                                    onClick={() => toggleLike(post.id)}
                                    className={`font-mono text-xs flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${post.likedByCurrentUser
                                            ? "bg-red-50 text-red-600 border border-red-200"
                                            : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 border border-zinc-200"
                                        }`}
                                >
                                    {post.likedByCurrentUser ? "❤️" : "🤍"} {post.likesCount}
                                </button>
                                <span className="font-mono text-xs text-zinc-400">💬 {post.comments?.length || 0}</span>
                            </div>

                            {/* Comments */}
                            {post.comments && post.comments.length > 0 && (
                                <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="bg-zinc-50 border border-zinc-100 rounded p-2">
                                            <p className="font-mono text-xs">
                                                <span className="font-bold text-zinc-700">{comment.authorName}:</span>{" "}
                                                <span className="text-zinc-600">{comment.content}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Comment */}
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Yorum yaz..."
                                    value={commentTexts[post.id] || ""}
                                    onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                                    onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-sm font-mono text-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    onClick={() => addComment(post.id)}
                                    className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-3 py-1.5 rounded-md text-xs font-mono transition-colors border border-zinc-200"
                                >
                                    Gönder
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
