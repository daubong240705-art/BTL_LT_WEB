import { Episode } from "@/app/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

import { EpisodePayload, movieApi } from "../../service/api/movie.api";

type ApiFailure = {
    statusCode?: number | string;
    error?: unknown;
};

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
            const res =
                mode === "add"
                    ? await movieApi.createEpisode({ ...data, movieId })
                    : await movieApi.updateEpisode(episodeId!, { ...data, movieId });

            const apiRes = res as ApiFailure;
            const statusCode = Number(apiRes.statusCode ?? 200);
            if (statusCode >= 400 || apiRes.error) {
                throw res;
            }

            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["episodes", movieId] });
            queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
            onClose?.();
        },
        onError: (error: unknown) => {
            const serverError = (error as ApiFailure)?.error;

            if (serverError && typeof serverError === "object" && !Array.isArray(serverError)) {
                for (const [key, value] of Object.entries(serverError)) {
                    if (key === "name") {
                        form.setError("name", { type: "server", message: String(value) });
                    } else if (key === "slug") {
                        form.setError("slug", { type: "server", message: String(value) });
                    } else if (key === "episodeOrder") {
                        form.setError("episodeOrder", { type: "server", message: String(value) });
                    } else {
                        form.setError("root", { type: "server", message: String(value) });
                    }
                }
                return;
            }

            const message = typeof serverError === "string" ? serverError : "Khong the luu tap phim";
            if (/slug/i.test(message)) {
                form.setError("slug", { type: "server", message });
                return;
            }
            if (/thu tu|episodeorder|order/i.test(message)) {
                form.setError("episodeOrder", { type: "server", message });
                return;
            }

            form.setError("root", { type: "server", message });
        },
    });
};

export const useDeleteEpisodeMutation = (movieId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (episodeId: number) => {
            const res = await movieApi.deleteEpisode(episodeId);
            const apiRes = res as ApiFailure;
            const statusCode = Number(apiRes.statusCode ?? 200);
            if (statusCode >= 400 || apiRes.error) {
                throw res;
            }
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["episodes", movieId] });
        },
    });
};
