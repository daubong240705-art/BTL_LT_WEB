"use client";

import { MessageCircle, Send, Trash2, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { createComment, deleteComment, getAccount, getCommentsByMovieId } from "@/lib/api/main.api";

type Props = {
    movieId: number;
};

const formatDateTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
};

export default function Comments({ movieId }: Props) {
    const [comments, setComments] = useState<MovieComment[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState("");

    const canComment = useMemo(() => Boolean(currentUser?.id), [currentUser?.id]);

    const fetchComments = async () => {
        const res = await getCommentsByMovieId(movieId);
        setComments(res.data ?? []);
    };

    useEffect(() => {
        let active = true;

        const bootstrap = async () => {
            setLoading(true);
            setError("");

            try {
                const [commentRes, accountRes] = await Promise.all([
                    getCommentsByMovieId(movieId),
                    getAccount()
                ]);

                if (!active) return;

                setComments(commentRes.data ?? []);
                setCurrentUser(accountRes.data ?? null);
            } catch {
                if (!active) return;
                setError("Khong tai duoc binh luan");
            } finally {
                if (active) setLoading(false);
            }
        };

        bootstrap();
        return () => {
            active = false;
        };
    }, [movieId]);

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed || submitting) return;

        setSubmitting(true);
        setError("");

        try {
            const res = await createComment(movieId, trimmed);
            if (res.data) {
                setComments((prev) => [res.data as MovieComment, ...prev]);
                setContent("");
                return;
            }

            setError(typeof res.error === "string" ? res.error : "Khong the them binh luan");
        } catch {
            setError("Vui long dang nhap de binh luan");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (comment: MovieComment) => {
        if (!currentUser) return;
        if (!window.confirm("Ban chac chan muon xoa binh luan nay?")) return;

        setDeletingId(comment.id);
        setError("");

        try {
            const res = await deleteComment(comment.id);
            if (Number(res.statusCode) >= 400) {
                setError(typeof res.error === "string" ? res.error : "Khong the xoa binh luan");
                return;
            }

            await fetchComments();
        } catch {
            setError("Khong the xoa binh luan");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                <MessageCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-white">
                    Binh luan <span className="text-gray-500 text-base">({comments.length})</span>
                </h2>
            </div>

            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center bg-gray-900">
                    <User className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={content}
                        disabled={!canComment}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder={canComment ? "Viet binh luan..." : "Dang nhap de binh luan"}
                        className="w-full bg-gray-900 text-white pl-4 pr-12 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!canComment || submitting}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 disabled:opacity-40"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {error ? <p className="text-sm text-red-400 mb-4">{error}</p> : null}

            {loading ? (
                <p className="text-gray-400 text-sm">Dang tai binh luan...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-400 text-sm">Chua co binh luan nao</p>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => {
                        const canDelete = currentUser?.role === "ADMIN" || currentUser?.id === comment.user_id;

                        return (
                            <div key={comment.id} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center bg-gray-900">
                                    <User className="w-5 h-5 text-gray-300" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-white text-sm">{comment.fullName}</span>
                                            <span className="text-gray-500 text-xs">{formatDateTime(comment.createdAt)}</span>
                                        </div>
                                        {canDelete ? (
                                            <button
                                                onClick={() => handleDelete(comment)}
                                                disabled={deletingId === comment.id}
                                                className="text-gray-400 hover:text-red-500 disabled:opacity-40"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        ) : null}
                                    </div>
                                    <p className="text-gray-300 text-sm">{comment.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
