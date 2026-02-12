"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEpisodesByMovie } from "@/lib/api/episode";
import { Film, Edit, Trash2 } from "lucide-react";
import { Episode } from "@/app/types/movie";


type Props = {
    movieId: number;
    onEdit?: (ep: Episode) => void;
    onDelete?: (ep: Episode) => void;
};

export default function EpisodeList({ movieId }: Props) {
    const { data: episodes = [] } = useQuery<Episode[]>({
        queryKey: ["episodes", movieId],
        queryFn: () => fetchEpisodesByMovie(movieId),
        enabled: !!movieId,
    });

    return (
        <> <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-500" />
                Danh sách tập ({episodes.length})
            </h3>
        </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 h-48 overflow-y-auto p-2 space-y-1">
                {episodes.length ? (
                    episodes.map((ep) => (
                        <div
                            key={ep.id}
                            className="flex justify-between items-center p-2 hover:bg-gray-700 rounded-lg group"
                        >
                            <div className="flex gap-3 items-center">
                                <span className="bg-gray-900 px-2 py-1 rounded text-xs font-mono text-gray-300">
                                    #{ep.id ?? ep.id}
                                </span>
                                <div>
                                    <div className="text-sm text-gray-200">{ep.name}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-50">
                                        {ep.video_url || "Chưa có link"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                <button >
                                    <Edit className="w-4 h-4 text-blue-400" />
                                </button>
                                <button
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Film className="w-8 h-8 opacity-20" />
                        <span className="text-xs">Chưa có tập phim nào</span>
                    </div>
                )}
            </div></>

    );
}
