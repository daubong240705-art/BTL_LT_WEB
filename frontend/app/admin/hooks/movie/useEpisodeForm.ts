import { Episode } from "@/app/types/global.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { EpisodePayload, movieApi } from "../../service/api/movie.api";
// import { episodeApi } from "../../service/api/episode.api";

const episodeSchema = z.object({
    name: z
        .string()
        .min(1, "Tiêu đề không được để trống")
        .max(255, "Tiêu đề quá dài"),

    videoUrl: z
        .string(),

    episodeOrder: z.coerce
        .number()
        .int("Thứ tự phải là số nguyên")
        .min(1, "Thứ tự phải >= 1"),
})

export type EpisodeFormValues = z.infer<typeof episodeSchema>;

export function useEpisodeForm(
    mode: "add" | "edit",
    initialData?: Episode
) {
    const form = useForm<EpisodePayload>({
        resolver: zodResolver(episodeSchema),
        defaultValues: {
            name: "",
            videoUrl: "",
            episodeOrder: 1,
            movieId: initialData?.movie_id ?? 0,
        },
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            form.reset({
                name: initialData.name,
                videoUrl: initialData.videoUrl,
                episodeOrder: initialData.episodeOrder,
                movieId: initialData.movie_id,
            });
        }
    }, [mode, initialData, form]);
    return form;
}


export const useEpisodeMutation = (
    mode: "add" | "edit",
    movieId: number,
    episodeId?: number,
    onClose?: () => void
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: EpisodePayload) =>
            mode === "add"
                ? movieApi.createEpisode({ ...data, movieId })
                : movieApi.updateEpisode(episodeId!, { ...data, movieId }),

        onSuccess: () => {
            // 🔥 invalidate đúng resource
            queryClient.invalidateQueries({ queryKey: ["episodes", movieId] });

            // nếu movie detail có count episode
            queryClient.invalidateQueries({ queryKey: ["movie", movieId] });

            onClose?.();
        },
    });
};
