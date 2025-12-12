import Banner from '../components/Banner';
import Row from '../components/Row';
import VideoPlayerModal from '../components/VideoPlayerModal';
import LoginModal from '../components/LoginModal';
import { useGetMoviesQuery } from '../store/api';
import { useEffect, useState } from 'react';
import { BannerSkeleton, RowSkeleton } from '../components/Skeleton';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const { data: movies = [], isLoading } = useGetMoviesQuery();
    const [heroMovie, setHeroMovie] = useState(null);
    const [playingMovie, setPlayingMovie] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { token } = useSelector((state) => state.auth);

    // Filter out shorts for the main dashboard (Home)
    const dashboardContent = movies.filter(movie => movie.type !== 'short');

    useEffect(() => {
        if (dashboardContent.length > 0) {
            const randomMovie = dashboardContent[Math.floor(Math.random() * dashboardContent.length)];
            setHeroMovie(randomMovie);
        }
    }, [movies]); // depend on movies query result

    const getMoviesByCategory = (category) => {
        return dashboardContent.filter(movie => movie.category === category || (!movie.category && category === 'Trending Now'));
    };

    const trending = getMoviesByCategory('Trending Now');
    const topRated = getMoviesByCategory('Top Rated');
    const action = getMoviesByCategory('Action Thrillers');
    const scifi = getMoviesByCategory('Sci-Fi & Fantasy');
    const award = getMoviesByCategory('Award Winning');

    const handlePlayMovie = (movie) => {
        if (!token) {
            setShowLoginModal(true);
            return;
        }
        setPlayingMovie(movie);
    };

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
            <Banner movie={heroMovie} onPlay={() => handlePlayMovie(heroMovie)} />

            <div className="-mt-32 relative z-10 space-y-8 pl-4 sm:pl-12">
                <Row title="Trending Now" movies={trending} isLargeRow onMovieClick={handlePlayMovie} />
                <Row title="Top Rated" movies={topRated} onMovieClick={handlePlayMovie} />
                <Row title="Action Thrillers" movies={action} onMovieClick={handlePlayMovie} />
                <Row title="Sci-Fi & Fantasy" movies={scifi} onMovieClick={handlePlayMovie} />
                <Row title="Award Winning" movies={award} onMovieClick={handlePlayMovie} />
            </div>

            <VideoPlayerModal
                isOpen={!!playingMovie}
                onClose={() => setPlayingMovie(null)}
                movie={playingMovie}
            />

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
};

export default Dashboard;
