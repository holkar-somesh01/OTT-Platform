import { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import Row from '../components/Row';
import VideoPlayerModal from '../components/VideoPlayerModal';
import { useGetMoviesQuery } from '../store/api';
import { BannerSkeleton, RowSkeleton } from '../components/Skeleton';

const Series = () => {
    const { data: movies = [], isLoading } = useGetMoviesQuery('series');
    const [heroMovie, setHeroMovie] = useState(null);
    const [playingMovie, setPlayingMovie] = useState(null);

    useEffect(() => {
        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            setHeroMovie(randomMovie);
        }
    }, [movies]);

    const getMoviesByCategory = (category) => {
        return movies.filter(movie => movie.category === category || (!movie.category && category === 'Trending Now'));
    };

    const trending = getMoviesByCategory('Trending Now');
    const topRated = getMoviesByCategory('Top Rated');
    const action = getMoviesByCategory('Action Thrillers');
    const scifi = getMoviesByCategory('Sci-Fi & Fantasy');
    const award = getMoviesByCategory('Award Winning');

    if (isLoading) {
        return (
            <div className="bg-primary min-h-screen text-white pb-10">
                <BannerSkeleton />
                <div className="-mt-32 relative z-10 space-y-8 pl-4 sm:pl-12">
                    <RowSkeleton isLargeRow />
                    <RowSkeleton />
                    <RowSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary min-h-screen text-primary-text pb-10">
            <Banner movie={heroMovie} onPlay={() => setPlayingMovie(heroMovie)} />

            <div className="-mt-32 relative z-10 space-y-8 pl-4 sm:pl-12">
                <Row title="Trending Series" movies={trending} isLargeRow onMovieClick={setPlayingMovie} />
                <Row title="Top Rated Series" movies={topRated} onMovieClick={setPlayingMovie} />
                <Row title="Action Thrillers" movies={action} onMovieClick={setPlayingMovie} />
                <Row title="Sci-Fi & Fantasy" movies={scifi} onMovieClick={setPlayingMovie} />
                <Row title="Award Winning" movies={award} onMovieClick={setPlayingMovie} />
            </div>

            <VideoPlayerModal
                isOpen={!!playingMovie}
                onClose={() => setPlayingMovie(null)}
                movie={playingMovie}
            />
        </div>
    );
};

export default Series;
