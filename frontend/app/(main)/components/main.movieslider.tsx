"use client";

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './main.moviecard';



interface MovieSliderProps {
    title: string;
    movies: Movie[];
}
interface ArrowProps {
    onClick?: () => void;
    className?: string;
}

function NextArrow(props: ArrowProps) {
    const { onClick, className } = props;

    if (className?.includes("slick-disabled")) return null;

    return (
        <button
            onClick={onClick}
            className="absolute -right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600 sm:-right-4">
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
    );
}

function PrevArrow(props: ArrowProps) {
    const { onClick, className } = props;
    if (className?.includes("slick-disabled")) return null;

    return (
        <button
            onClick={onClick}
            className="absolute -left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600 sm:-left-4">
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
    );
}

export function MovieSlider({ title, movies }: MovieSliderProps) {
    const settings = {
        dots: false,
        infinite: movies.length > 6,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        swipeToSlide: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1536,
                settings: {
                    slidesToShow: Math.min(5, movies.length),
                },
            },
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: Math.min(4, movies.length),
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(3, movies.length),
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(2, movies.length),
                    arrows: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                },
            },
        ],
    };

    if (!movies || movies.length === 0) return null;



    return (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="mb-6 border-l-4 border-red-600 pl-3 text-xl font-bold text-white sm:text-2xl">
                {title}
            </h2>

            <div className="relative">
                <Slider {...settings}>
                    {movies.map((movie) => (
                        <div key={movie.id} className="px-1.5 pb-4 sm:px-2">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}
