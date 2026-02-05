"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import MovieForm from "./MovieForm";
import { Movie } from "@/app/types/movie";


type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    mode: "add" | "edit";
    initialData?: Movie;
};



export default function MovieDialog({
    open,
    onOpenChange,
    mode,
    initialData,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-250 h-[90vh] p-0 bg-gray-900 border-gray-800  flex flex-col" showCloseButton={false}>
                <DialogHeader className="px-6 py-4 border-b border-gray-800 ">
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2 ">
                        {mode === "add" ? (
                            <Plus className="text-green-500" />
                        ) : (
                            <Edit className="text-blue-500" />
                        )}
                        {mode === "add" ? "Thêm Phim Mới" : "Chỉnh Sửa Phim"}
                    </DialogTitle>
                </DialogHeader>

                <MovieForm
                    mode={mode}
                    initialData={initialData}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
