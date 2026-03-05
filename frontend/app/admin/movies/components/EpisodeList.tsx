"use client";

import { useQuery } from "@tanstack/react-query";

import { Film, Edit, Trash2, Plus } from "lucide-react";
import { Episode } from "@/app/types/global.type";
import { movieApi } from "../../service/api/movie.api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Episodedialog from "./EpisodeDialog";



type Props = {
    movieId: number;
    onEdit?: (ep: Episode) => void;
    onDelete?: (ep: Episode) => void;
};

export type EpisodeDialogState =
    | { type: "add" }
    | { type: "edit"; episode: Episode }
    | null;

export default function EpisodeList({ movieId }: Props) {
    const { data: episodes = [] } = useQuery<Episode[]>({
        queryKey: ["episodes", movieId],
        queryFn: () => movieApi.getEpisodeByMovie(movieId),
        enabled: !!movieId,
    });


    const [dialog, setDialog] = useState<EpisodeDialogState>(null);

    return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-blue-500" />
                    Danh sách tập ({episodes.length})
                </h3>
                <Button
                    type="button"
                    onClick={() => setDialog({ type: "add" })}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Thêm tập
                </Button>
            </div>


            <div className="bg-gray-800 rounded-lg border border-gray-700 h-70 overflow-y-auto p-2 space-y-1 custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]">
                {episodes.length ? (
                    episodes.map((ep) => (
                        <div
                            key={ep.id}
                            className="flex justify-between items-center p-2 hover:bg-gray-700 rounded-lg group"
                        >
                            <div className="flex gap-3 items-center">
                                <span className="bg-gray-900 px-2 py-1 rounded text-xs font-mono text-gray-300">
                                    #{ep.episodeOrder}
                                </span>
                                <div>
                                    <div className="text-sm text-gray-200">{ep.name}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-70">
                                        {ep.videoUrl || "Chưa có link"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                <button>
                                    <Edit className="w-4 h-4 text-blue-400" />
                                </button>
                                <button>
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
            </div>

            <Episodedialog
                open={dialog !== null}
                onOpenChange={() => setDialog(null)}
                mode={dialog?.type === "edit" ? "edit" : "add"}
                initialData={dialog?.type === "edit" ? dialog.episode : undefined}
                movieId={movieId}
            />
        </>

    );
}
