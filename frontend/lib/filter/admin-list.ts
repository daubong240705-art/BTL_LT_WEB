type SearchParamValue = string | string[] | undefined;
type QueryValue = string | number | undefined;

export const DEFAULT_ADMIN_PAGE_SIZE = 8;

const readSearchParam = (value: SearchParamValue) =>
    Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

export const parseAdminTextParam = (value: SearchParamValue) =>
    readSearchParam(value).trim();

export const parseAdminPageParam = (value: SearchParamValue, fallback = 1) => {
    const parsed = Number(readSearchParam(value));
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export const buildAdminListHref = (
    pathname: string,
    params: Record<string, QueryValue>
) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (typeof value === "number") {
            if (Number.isFinite(value) && (key !== "page" || value > 1))
                searchParams.set(key, String(Math.floor(value)));

            return;
        }

        const normalized = value?.trim();
        if (normalized) searchParams.set(key, normalized);
    });

    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
};

const escapeFilterValue = (value: string) => value.replace(/'/g, "\\'");

const buildContainsFilter = (field: string, keyword: string) =>
    `${field} ~~ '%${escapeFilterValue(keyword)}%'`;

export const buildContainsAnyFilter = (fields: string[], keyword: string) => {
    const normalizedKeyword = keyword.trim();
    if (!normalizedKeyword) return "";

    const conditions = fields.map((field) =>
        buildContainsFilter(field, normalizedKeyword)
    );

    return conditions.length === 1
        ? conditions[0]
        : `(${conditions.join(" or ")})`;
};

export const joinAdminFilters = (...conditions: Array<string | undefined>) =>
    conditions.filter(Boolean).join(" and ");

const normalizeEnumParam = (value: string, allowedValues: readonly string[]) => {
    const normalized = value.trim().toUpperCase();
    return allowedValues.includes(normalized) ? normalized : "";
};

export type AdminMovieListState = {
    q: string;
    type: string;
    status: string;
    page: number;
};

export const normalizeAdminMovieType = (value: string) =>
    normalizeEnumParam(value, ["SINGLE", "SERIES"]);

export const normalizeAdminMovieStatus = (value: string) =>
    normalizeEnumParam(value, ["ONGOING", "COMPLETED"]);

export const buildAdminMovieFilter = (
    state: Pick<AdminMovieListState, "q" | "type" | "status">
) =>
    joinAdminFilters(
        buildContainsAnyFilter(["title", "slug"], state.q),
        state.type ? `type:'${state.type}'` : "",
        state.status ? `status:'${state.status}'` : ""
    );

export type AdminUserListState = {
    q: string;
    role: string;
    page: number;
};

export const normalizeAdminUserRole = (value: string) =>
    normalizeEnumParam(value, ["ADMIN", "USER"]);

export const buildAdminUserFilter = (
    state: Pick<AdminUserListState, "q" | "role">
) =>
    joinAdminFilters(
        buildContainsAnyFilter(["fullName", "username", "email"], state.q),
        state.role ? `role:'${state.role}'` : ""
    );

export type AdminCategoryListState = {
    q: string;
    page: number;
};

export const buildAdminCategoryFilter = (
    state: Pick<AdminCategoryListState, "q">
) => buildContainsAnyFilter(["name", "slug"], state.q);
