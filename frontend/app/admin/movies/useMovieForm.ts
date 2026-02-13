import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch } from "react-hook-form";
import { z } from "zod";
import { Movie } from "@/app/types/type";

export const movieSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(["ongoing", "completed"]),
    publish_year: z.number(),
    poster: z.instanceof(File).optional(),
    category_ids: z.array(z.number()),
});

export type MovieFormValues = z.infer<typeof movieSchema>;

export function useMovieForm(
    mode: "add" | "edit",
    initialData?: Movie
) {
    const defaultValues = useMemo<MovieFormValues>(() => {
        if (mode === "edit" && initialData) {
            return {
                title: initialData.title ?? "",
                slug: initialData.slug ?? "",
                description: initialData.description ?? "",
                status: initialData.status,
                publish_year: initialData.publish_year ?? 2025,
                category_ids: initialData.category_ids ?? [],
                poster: undefined,
            };
        }

        return {
            title: "",
            slug: "",
            description: "",
            status: "ongoing",
            publish_year: 2025,
            category_ids: [],
            poster: undefined,
        };
    }, [mode, initialData]);

    const form = useForm<MovieFormValues>({
        resolver: zodResolver(movieSchema),
        defaultValues,
    });

    const posterFile = useWatch({
        control: form.control,
        name: "poster",
    });


    const posterPreview = useMemo(() => {
        if (posterFile instanceof File) {
            return URL.createObjectURL(posterFile);
        }

        if (mode === "edit" && initialData?.poster_url) {
            return initialData.poster_url;
        }

        return null;
    }, [posterFile, mode, initialData]);


    return {
        form,
        posterPreview,
    };
}
