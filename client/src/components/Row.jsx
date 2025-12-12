import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const Row = ({ title, movies = [], isLargeRow = false, onMovieClick }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <div className="pl-4 sm:pl-12 my-8 relative group">
            <h2 className="text-2xl font-bold text-primary-text mb-4 transition-colors duration-200">{title}</h2>

            <div className="relative">
                <div
                    className={`absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-10 md:w-12 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${!movies.length ? 'hidden' : ''}`}
                    onClick={() => scroll("left")}
                >
                    <ChevronLeft className="text-white" size={40} />
                </div>

                <div
                    ref={rowRef}
                    className="flex overflow-x-scroll scrollbar-hide gap-4 py-4 pr-12 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className={`relative flex-none transition-transform duration-300 hover:scale-105 md:hover:scale-110 cursor-pointer ${isLargeRow ? "w-[160px] md:w-[200px]" : "w-[240px] md:w-[280px]"}`}
                            onClick={() => onMovieClick && onMovieClick(movie)}
                        >
                            <img
                                className={`rounded-md object-cover w-full shadow-lg ${isLargeRow ? "h-[240px] md:h-[300px]" : "h-[135px] md:h-[160px]"}`}
                                src={getImageUrl(movie.posterUrl || movie.poster_path) || "https://via.placeholder.com/300x450"}
                                alt={movie.title}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <span className="text-white font-bold text-center px-2">{movie.title}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className={`absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-10 md:w-12 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${!movies.length ? 'hidden' : ''}`}
                    onClick={() => scroll("right")}
                >
                    <ChevronRight className="text-white" size={40} />
                </div>
            </div>
        </div>
    );
};

export default Row;
