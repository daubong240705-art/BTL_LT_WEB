import Link from "next/link";
import { ArrowLeft, SearchX, TextSearch } from "lucide-react";

import { MovieCard } from "../components/main.moviecard";
import { getMovies, searchMovies } from "@/lib/api/main.api";
import { MovieQueryBuilder, movieSearchParamsCache } from "@/lib/filter/MovieQueryBuilder";

type SearchPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const parsed = await movieSearchParamsCache.parse(searchParams);

    const state = {
        q: parsed.q,
        type: parsed.type,
        category: parsed.category,
        page: parsed.page,
    };

    const query = MovieQueryBuilder
        .fromState(state)
        .withSize(10)
        .buildApiParams();

    let searchRes: IBackendRes<IModelPaginate<Movie>>;

    if (query.q) {
        // Tim kiem theo ten: goi API search rieng
        searchRes = await searchMovies({
            q: query.q,
            page: query.page,
            size: query.size
        });
    } else {
        // Loc thong thuong (type/category): dung getMovies + spring filter
        const conditions: string[] = [];

        if (query.type) {
            conditions.push(`type:'${query.type.toUpperCase()}'`);
        }

        if (query.category) {
            conditions.push(`categories.slug:'${query.category}'`);
        }

        const filter = conditions.length > 0 ? conditions.join(" and ") : undefined;
        searchRes = await getMovies(filter, query.page, query.size);
    }

    const movies = searchRes.data?.result ?? [];
    const meta = searchRes.data?.meta;

    const currentPage = meta?.current ?? query.page;
    const totalPages = meta?.pages ?? 1;
    const totalItems = meta?.total ?? movies.length;

    const toHref = (page: number) =>
        MovieQueryBuilder
            .fromState(state)
            .withPage(page)
            .withSize(10)
            .buildHref();

    return (
        <div className="min-h-screen bg-gray-900 pb-20 pt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-4 mb-8 border-b border-gray-800 pb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <TextSearch className="h-7 w-7" />
                        Ket qua tim kiem
                        {state.q ? <span className="text-gray-400 text-xl font-normal">&quot;{state.q}&quot;</span> : null}
                        {state.type ? <span className="text-red-400 text-base">[{state.type.toUpperCase()}]</span> : null}
                        {state.category ? <span className="text-emerald-400 text-base">[The loai:{state.category}]</span> : null}
                    </h1>

                    <p className="text-gray-400 text-sm">
                        Tim thay <span className="text-white font-semibold">{totalItems}</span> ket qua
                    </p>
                </div>

                {movies.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <div key={movie.id} className="animate-in fade-in zoom-in duration-500">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 ? (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <Link
                                    href={toHref(Math.max(1, currentPage - 1))}
                                    className={`px-4 py-2 rounded border text-sm ${
                                        currentPage <= 1
                                            ? "pointer-events-none opacity-40 border-gray-700 text-gray-500"
                                            : "border-gray-600 text-gray-200 hover:border-red-500 hover:text-white"
                                    }`}
                                >
                                    Prev
                                </Link>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                                    .map((p, idx, arr) => {
                                        const prev = arr[idx - 1];
                                        const showDots = prev && p - prev > 1;
                                        return (
                                            <div key={p} className="flex items-center gap-2">
                                                {showDots ? <span className="text-gray-500">...</span> : null}
                                                <Link
                                                    href={toHref(p)}
                                                    className={`px-3 py-2 rounded border text-sm ${
                                                        p === currentPage
                                                            ? "bg-red-600 border-red-600 text-white"
                                                            : "border-gray-600 text-gray-200 hover:border-red-500 hover:text-white"
                                                    }`}
                                                >
                                                    {p}
                                                </Link>
                                            </div>
                                        );
                                    })}

                                <Link
                                    href={toHref(Math.min(totalPages, currentPage + 1))}
                                    className={`px-4 py-2 rounded border text-sm ${
                                        currentPage >= totalPages
                                            ? "pointer-events-none opacity-40 border-gray-700 text-gray-500"
                                            : "border-gray-600 text-gray-200 hover:border-red-500 hover:text-white"
                                    }`}
                                >
                                    Next
                                </Link>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-800 p-6 rounded-full mb-4">
                            <SearchX className="w-16 h-16 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Khong tim thay ket qua</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            Thu tu khoa khac hoac bo dau tieng Viet de de tim hon.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Ve trang chu
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
