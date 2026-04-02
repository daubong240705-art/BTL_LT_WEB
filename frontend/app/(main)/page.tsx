import { getMovieBySlug, getMovieRankings, getMoviesByCategorySlug } from "@/lib/api/main.api";

import HomeAdModal from "./components/home-ad-modal";
import { HomeRankings } from "./components/home.rankings";
import HeroBanner from "./components/main.herobanner";
import { MovieSlider } from "./components/main.movieslider";

export default async function HomePage() {
    const [
        bannerRes,
        cartoonRes,
        animeRes,
        cinemaRes,
        rankingsRes,
    ] = await Promise.all([
        getMovieBySlug("que"),
        getMoviesByCategorySlug("hoat-hinh"),
        getMoviesByCategorySlug("anime"),
        getMoviesByCategorySlug("chieu-rap"),
        getMovieRankings(),
    ]);

    const movieBanner = bannerRes.data ?? null;
    const cartoonMovie = cartoonRes.data?.result ?? [];
    const animeMovie = animeRes.data?.result ?? [];
    const cinemaMovie = cinemaRes.data?.result ?? [];
    const rankings = rankingsRes.data ?? null;

    return (
        <>
            <HomeAdModal />
            <div className="min-h-screen bg-gray-900">
                {movieBanner ? <HeroBanner MovieBanner={movieBanner} /> : null}
                <MovieSlider title="Hoạt hình" movies={cartoonMovie} />
                <MovieSlider title="Anime" movies={animeMovie} />
                <MovieSlider title="Chiếu rạp" movies={cinemaMovie} />
                {/* <HomeRankings rankings={rankings} /> */}
            </div>
        </>
    );
}
