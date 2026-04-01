import { Button } from "@/components/ui/button";
import { getFirstEpisode } from "@/lib/api/main.api";
import { Info, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FavoriteToggle } from "./favorite-toggle";

type Props = {
    MovieBanner: Movie;
};

export default async function HeroBanner({ MovieBanner }: Props) {
    if (!MovieBanner?.slug) {
        return null;
    }

    const firstEpisodeRes = await getFirstEpisode(MovieBanner.slug);
    const firstEpisode = firstEpisodeRes.data ?? null;
    const primaryHref = firstEpisode?.slug
        ? `/watch/${MovieBanner.slug}/${firstEpisode.slug}`
        : `/movie/${MovieBanner.slug}`;

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black">
            <div className="absolute inset-0">
                <Image
                    src={MovieBanner.thumbUrl || MovieBanner.posterUrl}
                    alt={MovieBanner.title}
                    fill
                    priority
                    quality={92}
                    sizes="100vw"
                    className="object-cover object-center md:object-contain md:object-right-top"
                />
                <div className="absolute inset-0 bg-black/15" />
                <div className="absolute left-0 top-0 h-full w-full bg-linear-to-r from-black via-black/72 to-transparent md:w-[65%]" />
                <div className="absolute bottom-0 left-0 h-[35%] w-full bg-linear-to-t from-black via-black/70 to-transparent" />
                <div className="absolute left-0 top-0 h-[25%] w-full bg-linear-to-b from-black/80 to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto flex min-h-screen items-center px-4 pb-12 pt-24 sm:px-6 sm:pb-16 lg:px-8">
                <div className="max-w-xl sm:max-w-2xl">
                    <h1 className="mb-4 break-words text-4xl leading-tight font-bold text-white sm:text-5xl md:text-6xl [overflow-wrap:anywhere]">
                        {MovieBanner.title}
                    </h1>

                    <div className="mb-6 flex flex-wrap items-center gap-3 text-gray-300 sm:gap-4">
                        <span>{MovieBanner.publishYear}</span>
                        <span className="rounded border border-gray-700 bg-gray-800/80 px-3 py-1">
                            {MovieBanner.status === "ONGOING" ? "Dang phat" : "Hoan thanh"}
                        </span>
                    </div>

                    <p className="mb-8 max-w-2xl break-words text-base leading-relaxed text-gray-300 line-clamp-4 sm:text-lg [overflow-wrap:anywhere]">
                        {MovieBanner.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <Link href={primaryHref}>
                            <Button className="flex h-14 w-14 items-center justify-center rounded-full bg-red-400 shadow-lg shadow-yellow-500/30 transition-transform hover:scale-105 hover:bg-red-200 sm:h-16 sm:w-16">
                                <Play className="ml-1 h-5 w-5 fill-black text-black sm:h-6 sm:w-6" />
                            </Button>
                        </Link>

                        <div className="flex items-center overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur">
                            <FavoriteToggle
                                movie={MovieBanner}
                                showLabel={false}
                                className="flex items-center justify-center bg-transparent px-4! py-5 transition-colors hover:bg-white/10 sm:px-5! sm:py-6"
                                iconClassName="h-5! w-5! text-white"
                            />

                            <div className="h-8 w-px bg-white/20" />

                            <Link
                                href={`/movie/${MovieBanner.slug}`}
                                className="flex items-center justify-center px-4! py-5 transition-colors hover:bg-white/10 sm:px-5! sm:py-6"
                            >
                                <Info className="h-5! w-5! text-white" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
