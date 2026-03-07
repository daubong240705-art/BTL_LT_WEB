import { Category } from "@/app/types/global.type";
import { FormError } from "@/components/shared/FormError";
import { AppInput } from "@/components/shared/AppInput";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { CategoryFormValues, useCategoryForm, useCategoryMutation } from "../../hooks/category/useCategoryForm";

type Props = {
    mode: "add" | "edit";
    initialData?: Category;
    onClose: () => void;
};

export default function CategoryForm({ mode, initialData, onClose }: Props) {
    const form = useCategoryForm(mode, initialData);
    const mutation = useCategoryMutation(mode, form, initialData?.id, onClose);

    const onSubmit = (data: CategoryFormValues) => {
        form.clearErrors("root");
        mutation.mutate(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col">
                <div className="flex-1 px-6 pb-6 space-y-2">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Ten the loai</label>
                        <AppInput
                            {...form.register("name")}
                            type="text"
                            color="green"
                            placeholder="Nhap ten the loai"
                            className="px-4 py-5"
                        />
                        <FormError message={form.formState.errors.name?.message} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-400">Slug</label>
                        <AppInput
                            {...form.register("slug")}
                            type="text"
                            color="green"
                            placeholder="Nhap duong dan"
                            className="px-4 py-5"
                        />
                        <FormError message={form.formState.errors.slug?.message} />
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-800">
                <Button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800">
                    Huy bo
                </Button>
                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {mutation.isPending ? "Dang luu..." : "Luu"}
                </Button>
            </div>

            <div className="px-6 pb-4">
                <FormError message={form.formState.errors.root?.message} />
            </div>
        </form>
    );
}
