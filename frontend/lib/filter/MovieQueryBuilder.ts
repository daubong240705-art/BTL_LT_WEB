import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";

export const movieSearchParsers = {
    q: parseAsString.withDefault(""),
    type: parseAsString.withDefault(""),
    category: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
};

export const movieSearchParamsCache = createSearchParamsCache(movieSearchParsers);

export type MovieSearchState = {
    q: string;
    type: string;
    category: string;
    page: number;
};

const normalizeType = (type?: string) => {
    const val = (type ?? "").trim().toLowerCase();
    if (val === "series") return "series";
    if (val === "single") return "single";
    return "";
};

const normalizeCategory = (category?: string) => (category ?? "").trim().toLowerCase();
const normalizeQuery = (q?: string) => (q ?? "").trim();

export class MovieQueryBuilder {
    private q = "";
    private type = "";
    private category = "";
    private page = 1;
    private size = 10;

    static fromState(state: MovieSearchState) {
        return new MovieQueryBuilder()
            .withQuery(state.q)
            .withType(state.type)
            .withCategory(state.category)
            .withPage(state.page);
    }

    withQuery(q?: string) {
        this.q = normalizeQuery(q);
        return this;
    }

    withType(type?: string) {
        this.type = normalizeType(type);
        return this;
    }

    withCategory(category?: string) {
        this.category = normalizeCategory(category);
        return this;
    }

    withPage(page?: number) {
        const parsed = Number(page);
        this.page = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
        return this;
    }

    withSize(size = 10) {
        const parsed = Number(size);
        this.size = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 10;
        return this;
    }

    buildApiParams() {
        return {
            ...(this.q ? { q: this.q } : {}),
            ...(this.type ? { type: this.type } : {}),
            ...(this.category ? { category: this.category } : {}),
            page: this.page,
            size: this.size,
        };
    }

    buildHref() {
        const params = new URLSearchParams();
        if (this.q) params.set("q", this.q);
        if (this.type) params.set("type", this.type);
        if (this.category) params.set("category", this.category);
        params.set("page", String(this.page));

        return `/search?${params.toString()}`;
    }

    getState(): MovieSearchState {
        return {
            q: this.q,
            type: this.type,
            category: this.category,
            page: this.page,
        };
    }
}

export const buildMovieSearchHref = (state: Partial<MovieSearchState>) => {
    const builder = new MovieQueryBuilder()
        .withQuery(state.q)
        .withType(state.type)
        .withCategory(state.category)
        .withPage(state.page);

    return builder.buildHref();
};
