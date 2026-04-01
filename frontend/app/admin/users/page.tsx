import { getAdminUsers } from "@/lib/api/admin.api";
import {
    buildAdminUserFilter,
    DEFAULT_ADMIN_PAGE_SIZE,
    normalizeAdminUserRole,
    parseAdminPageParam,
    parseAdminTextParam,
    type AdminUserListState,
} from "@/lib/filter/admin-list";

import UsersController from "./components/UserController";

type AdminUsersPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminUsersPage({
    searchParams,
}: AdminUsersPageProps) {
    const params = await searchParams;
    const initialState: AdminUserListState = {
        q: parseAdminTextParam(params.q),
        role: normalizeAdminUserRole(parseAdminTextParam(params.role)),
        page: parseAdminPageParam(params.page),
    };

    const usersRes = await getAdminUsers({
        filter: buildAdminUserFilter(initialState),
        page: initialState.page,
        size: DEFAULT_ADMIN_PAGE_SIZE,
    });

    const users = usersRes.data?.result ?? [];
    const totalPages = usersRes.data?.meta?.pages ?? 1;
    const totalItems = usersRes.data?.meta?.total ?? users.length;

    return (
        <UsersController
            key={JSON.stringify(initialState)}
            users={users}
            initialState={initialState}
            totalPages={totalPages}
            totalItems={totalItems}
        />
    );
}
