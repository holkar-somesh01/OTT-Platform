import { Play, Info } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const Banner = ({ movie, onPlay }) => {
    if (!movie) return null;

    return (
        <header
            className="relative h-[80vh] object-contain text-white"
            style={{
                backgroundSize: 'cover',
                backgroundImage: `url("${getImageUrl(movie.posterUrl || movie.backdrop_path) || 'https://via.placeholder.com/1920x1080'}")`,
                backgroundPosition: 'center center',
            }}
        >
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Gradient to blend top (nav) and left (text) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

            <div className="absolute top-[35%] px-4 sm:px-12 w-full pt-32 md:pt-0">
                <h1 className="text-4xl md:text-6xl font-bold pb-4 max-w-2xl drop-shadow-2xl">
                    {movie.title}
                </h1>

                <p className="w-full md:max-w-[60%] lg:max-w-[40%] text-lg md:text-xl font-medium drop-shadow-md mb-6 line-clamp-3 text-gray-200">
                    {movie.description || movie.overview}
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onPlay}
                        className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded hover:bg-white/80 transition-colors font-bold text-lg"
                    >
                        <Play size={24} fill="currentColor" />
                        Play
                    </button>
                    <button className="flex items-center gap-2 bg-gray-600/80 text-white px-8 py-3 rounded hover:bg-gray-600/60 backdrop-blur-sm transition-colors font-bold text-lg">
                        <Info size={24} />
                        More Info
                    </button>
                </div>
            </div>

            {/* Fade into rest of page content */}
            <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-primary to-transparent transition-colors duration-200" />
        </header>
    );
};

export default Banner;
