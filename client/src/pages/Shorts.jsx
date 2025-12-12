import { useState } from 'react';
import { Play, Download, Check, Plus } from 'lucide-react';
import ShortsModal from '../components/ShortsModal';
import { useGetMoviesQuery, useToggleSaveContentMutation, useGetSavedContentQuery } from '../store/api';
import { getImageUrl } from '../utils/imageUtils';
import { GridSkeleton } from '../components/Skeleton';

const Shorts = () => {
    const { data: shorts = [], isLoading } = useGetMoviesQuery('short');
    const { data: savedContent = [] } = useGetSavedContentQuery();
    const [toggleSave] = useToggleSaveContentMutation();
    const [selectedVideo, setSelectedVideo] = useState(null);

    const isSaved = (id) => savedContent.some(item => item.id === id);

    const handleSave = async (e, id) => {
        e.stopPropagation();
        try {
            await toggleSave({ movieId: id }).unwrap();
        } catch (error) {
            console.error('Failed to toggle save:', error);
        }
    };

    const handleDownload = (e, url, title) => {
        e.stopPropagation();
        if (!url) return alert('No video source available');

        const link = document.createElement('a');
        link.href = url;
        link.download = title || 'video';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="pt-24 px-4 sm:px-12 pb-10 min-h-screen bg-primary">
                <h2 className="text-3xl font-bold text-primary-text mb-8">Shorts</h2>
                <GridSkeleton />
            </div>
        );
    }

    return (
        <div className="pt-24 px-4 sm:px-12 pb-10 min-h-screen bg-primary">
            <h2 className="text-3xl font-bold text-primary-text mb-8">Shorts</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {shorts.map((short) => (
                    <div
                        key={short.id}
                        className="relative aspect-[9/16] group cursor-pointer rounded-xl overflow-hidden"
                        onClick={() => setSelectedVideo(short)}
                    >
                        <img
                            src={getImageUrl(short.posterUrl || short.thumbnail) || "https://via.placeholder.com/300x533?text=Short"}
                            alt={short.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <h3 className="text-white font-bold text-sm mb-1">{short.title}</h3>
                            <div className="flex gap-2 justify-end mt-2">
                                <button
                                    className={`p-2 rounded-full text-white backdrop-blur-sm ${isSaved(short.id) ? 'bg-accent' : 'bg-white/20 hover:bg-white/30'}`}
                                    onClick={(e) => handleSave(e, short.id)}
                                >
                                    {isSaved(short.id) ? <Check size={16} /> : <Plus size={16} />}
                                </button>
                                <button
                                    className="p-2 rounded-full text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                    onClick={(e) => handleDownload(e, getImageUrl(short.videoUrl), short.title)}
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                                <Play size={24} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ShortsModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                video={selectedVideo}
            />
        </div>
    );
};

export default Shorts;
