"use client";

import { Episode } from "@/app/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { applyFormMutationError, assertApiSuccess } from "../_shared/mutation.utils";

import { EpisodePayload, movieApi } from "../../service/api/movie.api";

const episodeSchema = z.object({
    name: z.string().min(1, "Tieu de khong duoc de trong").max(255, "Tieu de qua dai"),
    slug: z
        .string()
        .min(1, "Slug khong duoc de trong")
        .regex(/^[a-z0-9-]+$/, "Slug chi gom chu thuong, so va dau -"),
    videoUrl: z.string(),
    episodeOrder: z.coerce.number().int("Thu tu phai la so nguyen").min(1, "Thu tu phai >= 1"),
});

export type EpisodeFormValues = z.infer<typeof episodeSchema>;

export function useEpisodeForm(mode: "add" | "edit", initialData?: Episode) {
    const form = useForm<EpisodePayload>({
        resolver: zodResolver(episodeSchema),
        defaultValues: {
            name: "",
            slug: "",
            videoUrl: "",
            episodeOrder: 1,
            movieId: initialData?.movieId ?? initialData?.movie_id ?? 0,
        },
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            form.reset({
                name: initialData.name,
                slug: initialData.slug,
                videoUrl: initialData.videoUrl,
                episodeOrder: initialData.episodeOrder,
                movieId: initialData.movieId ?? initialData.movie_id ?? 0,
            });
        }
    }, [mode, initialData, form]);

    return form;
}

export const useEpisodeMutation = (
    mode: "add" | "edit",
    form: UseFormReturn<EpisodePayload>,
    movieId: number,
    episodeId?: number,
    onClose?: () => void
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: EpisodePayload) => {
            const response =
                mode === "add"
                    ? await movieApi.createEpisode({ ...data, movieId })
                    : await movieApi.updateEpisode(episodeId!, { ...data, movieId });
            return assertApiSuccess(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["episodes", movieId] });
            queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
            onClose?.();
        },
        onError: (error: unknown) => {
            applyFormMutationError(form, error, {
                fallbackMessage: "Khong the luu tap phim",
                fieldMap: {
                    name: "name",
                    slug: "slug",
                    episodeOrder: "episodeOrder",
                },
                messageRules: [
                    { pattern: /slug/i, field: "slug" },
                    { pattern: /thu tu|episodeorder|order/i, field: "episodeOrder" },
                ],
            });
        },
    });
};

export const useDeleteEpisodeMutation = (movieId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (episodeId: number) => {
            const response = await movieApi.deleteEpisode(episodeId);
            return assertApiSuccess(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["episodes", movieId] });
        },
    });
};
