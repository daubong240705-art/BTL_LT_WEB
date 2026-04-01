import { getAdminCategories } from "@/lib/api/admin.api";
import {
    buildAdminCategoryFilter,
    parseAdminPageParam,
    parseAdminTextParam,
    type AdminCategoryListState,
} from "@/lib/filter/admin-list";

import CategoriesController from "./components/CategoryController";

const CATEGORY_PAGE_SIZE = 12;

type AdminCategoriesPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminCategoriesPage({
    searchParams,
}: AdminCategoriesPageProps) {
    const params = await searchParams;
    const initialState: AdminCategoryListState = {
        q: parseAdminTextParam(params.q),
        page: parseAdminPageParam(params.page),
    };

    const categoriesRes = await getAdminCategories({
        filter: buildAdminCategoryFilter(initialState),
        page: initialState.page,
        size: CATEGORY_PAGE_SIZE,
    });

    const categories = categoriesRes.data?.result ?? [];
    const totalPages = categoriesRes.data?.meta?.pages ?? 1;
    const totalItems = categoriesRes.data?.meta?.total ?? categories.length;

    return (
        <CategoriesController
            key={JSON.stringify(initialState)}
            categories={categories}
            initialState={initialState}
            totalPages={totalPages}
            totalItems={totalItems}
        />
    );
}
