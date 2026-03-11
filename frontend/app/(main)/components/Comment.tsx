"use client";

import { MessageCircle, MessageCircleMore, Send, Trash2, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createComment, deleteComment, getCommentsByMovieId } from "@/lib/api/main.api";
import { useAuth } from "@/app/context/auth-provider";

type Props = {
    movieId: number;
};

const formatDateTime = (value?: string) => {
    if (!value) return "";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
};

export default function Comments({ movieId }: Props) {
    const { user: currentUser } = useAuth();
    const [comments, setComments] = useState<MovieComment[]>([]);
    const [content, setContent] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);

    const fetchComments = useCallback(async (p = 1) => {
        const res = await getCommentsByMovieId(movieId, p, 5);
        setComments(res.data?.result ?? []);
        setTotalPages(res.data?.meta.pages ?? 1);
        setTotalComments(res.data?.meta.total ?? 0);
        setPage(res.data?.meta.current ?? p);
    }, [movieId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchComments(1);
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchComments]);

    const handleSubmit = async () => {
        const text = content.trim();
        if (!text || !currentUser) return;

        const res = await createComment(movieId, text);
        if (res.data) {
            setContent("");
            await fetchComments(1);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Ban chac chan muon xoa binh luan?")) return;

        const res = await deleteComment(id);
        if (Number(res.statusCode) < 400) {
            const nextPage = comments.length === 1 && page > 1 ? page - 1 : page;
            await fetchComments(nextPage);
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                <MessageCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-white">
                    Binh luan ({totalComments})
                </h2>
            </div>

            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center bg-gray-900">
                    <Avatar>
                        <AvatarImage src={currentUser?.avatarUrl} />
                        <AvatarFallback>
                            <User className="w-5 h-5 text-gray-300" />
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 relative">
                    <Textarea
                        value={content}
                        disabled={!currentUser}
                        rows={2}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void handleSubmit();
                            }
                        }}
                        placeholder={currentUser ? "Viet binh luan..." : "Dang nhap de binh luan"}
                        className="w-full bg-gray-900 text-white pl-4 pr-12 py-3 rounded-lg border border-gray-700 resize-none break-all"
                    />

                    <button
                        onClick={() => void handleSubmit()}
                        disabled={!currentUser}
                        className="absolute right-3 bottom-3 text-gray-400 hover:text-red-500 disabled:opacity-40"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {comments.length === 0 ? (
                <div className="h-50 flex flex-col items-center justify-center bg-gray-800 rounded-2xl border border-gray-700 text-gray-400">
                    <MessageCircleMore className="h-10 w-10" />
                    <p>Chua co binh luan</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((c) => {
                        const canDelete = currentUser?.role === "ADMIN" || currentUser?.id === c.user_id;

                        return (
                            <div key={c.id} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center bg-gray-900">
                                    <Avatar>
                                        <AvatarImage src={c.avatarUrl} />
                                        <AvatarFallback>
                                            <User className="w-5 h-5 text-gray-300" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <div className="flex gap-2 text-sm">
                                            <span className="font-bold text-white">{c.fullName}</span>
                                            <span className="text-gray-500">{formatDateTime(c.createdAt)}</span>
                                        </div>

                                        {canDelete ? (
                                            <button
                                                onClick={() => void handleDelete(c.id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        ) : null}
                                    </div>

                                    <p className="text-gray-300 text-sm break-all whitespace-pre-line">{c.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {totalPages > 1 ? (
                <Pagination className="mt-6">
                    <PaginationContent>
                        {page > 1 ? (
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        void fetchComments(page - 1);
                                    }}
                                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                                />
                            </PaginationItem>
                        ) : null}

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    isActive={p === page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        void fetchComments(p);
                                    }}
                                    className={`border-gray-700 ${p === page
                                        ? "bg-red-600 text-white hover:bg-red-600"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                        }`}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {page < totalPages ? (
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        void fetchComments(page + 1);
                                    }}
                                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                                />
                            </PaginationItem>
                        ) : null}
                    </PaginationContent>
                </Pagination>
            ) : null}
        </div>
    );
}