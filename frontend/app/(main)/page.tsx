import HeroBanner from "./components/main.herobanner";
import { MovieSlider } from "./components/main.movieslider";

import { getAllMovieByCategorySlug, getMovieBySlug } from "./service/main.api";


const MovieBanner = await getMovieBySlug("tieu-yeu")
const cartoonMovie = await getAllMovieByCategorySlug("hoat-hinh");
const animeMovie = await getAllMovieByCategorySlug("anime");
const cinemaMovie = await getAllMovieByCategorySlug("chieu-rap");


export default function HomePage() {
    // console.log(actionMovie)
    return (
        <div className="min-h-screen bg-gray-900">
            <HeroBanner MovieBanner={MovieBanner} />
            <MovieSlider title="Hoạt hình" movies={cartoonMovie} />
            <MovieSlider title="Anime" movies={animeMovie} />
            <MovieSlider title="Chiếu rạp" movies={cinemaMovie} />
        </div>
    );
}