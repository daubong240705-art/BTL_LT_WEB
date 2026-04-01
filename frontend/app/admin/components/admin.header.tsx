import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type PageHeaderProps = {
    title: string;
    description?: string;
    count?: number;
    onAdd: () => void;
};

export default function PageHeader({
    title,
    description,
    count,
    onAdd,
}: PageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                <h1 className="break-words text-2xl font-bold text-white sm:text-3xl [overflow-wrap:anywhere]">
                    Trang quản lý {title}
                </h1>

                {(description || count !== undefined) && (
                    <p className="mt-1 break-words text-sm text-gray-400 [overflow-wrap:anywhere]">
                        {description}
                        {count !== undefined && <span> Tổng số: {count}</span>}
                    </p>
                )}
            </div>

            <div className="sm:shrink-0">
                <Button
                    onClick={onAdd}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow-lg hover:bg-green-700 sm:w-auto sm:px-6"
                >
                    <Plus className="h-5 w-5" />
                    Thêm {title}
                </Button>
            </div>
        </div>
    );
}
