import { Edit, Film, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-6">
            {categories?.map((category) => (
                <div
                    key={category.id}
                    className="group rounded-xl border border-gray-700 bg-gray-800 p-5 transition-all hover:-translate-y-1 hover:border-gray-600 sm:p-6"
                >
                    <div className="mb-4 flex items-start gap-4">
                        <div className="rounded-xl bg-gray-700/50 p-3.5 transition-colors group-hover:bg-green-600/20">
                            <Film className="h-6 w-6 text-gray-400 transition-colors group-hover:text-green-400" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="break-words text-base font-bold text-white transition-colors group-hover:text-green-400 sm:text-lg [overflow-wrap:anywhere]">
                                {category.name}
                            </h3>
                            <p className="mt-1 break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
                                {category.slug}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end border-t border-gray-700/50 pt-4">
                        <div className="flex gap-2">
                            <Button
                                onClick={() => onEdit(category)}
                                className="rounded-lg border border-blue-600/20 bg-blue-600/10 p-2 text-blue-500 transition-colors hover:bg-blue-600 hover:text-white"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => onDelete(category)}
                                className="rounded-lg border border-red-600/20 bg-red-600/10 p-2 text-red-500 transition-colors hover:bg-red-600 hover:text-white"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
