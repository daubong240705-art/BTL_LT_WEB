"use client";

import { useEffect, useState } from "react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './main.moviecard';

const MOBILE_DEVICE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

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
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(0);

    useEffect(() => {
        const desktopPointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

        const updateLayoutMode = () => {
            const hasDesktopPointer = desktopPointerQuery.matches;
            const matchesMobileDevice = MOBILE_DEVICE_REGEX.test(window.navigator.userAgent);

            setIsMobileDevice(matchesMobileDevice && !hasDesktopPointer);
            setViewportWidth(window.innerWidth);
        };

        updateLayoutMode();
        window.addEventListener("resize", updateLayoutMode);
        desktopPointerQuery.addEventListener("change", updateLayoutMode);

        return () => {
            window.removeEventListener("resize", updateLayoutMode);
            desktopPointerQuery.removeEventListener("change", updateLayoutMode);
        };
    }, []);

    const useMobileScroller = isMobileDevice;
    const useCompactDesktopGrid = !isMobileDevice && viewportWidth > 0 && viewportWidth < 1536;

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
                breakpoint: 1800,
                settings: {
                    slidesToShow: Math.min(5, movies.length),
                },
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: Math.min(4, movies.length),
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

            {useMobileScroller ? (
                <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="w-[72vw] min-w-[170px] max-w-[220px] shrink-0 snap-start"
                        >
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            ) : useCompactDesktopGrid ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {movies.map((movie) => (
                        <div key={movie.id}>
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative">
                    <Slider {...settings}>
                        {movies.map((movie) => (
                            <div key={movie.id} className="px-1.5 pb-4 sm:px-2">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </Slider>
                </div>
            )}
        </section>
    );
}
