import { X } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const VideoPlayerModal = ({ isOpen, onClose, movie }) => {
    if (!isOpen || !movie) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full transition-colors"
                title="Close Player"
            >
                <X size={32} />
            </button>

            {/* Video Player */}
            <div className="w-full h-full">
                <video
                    src={getImageUrl(movie.videoUrl || movie.video_url)}
                    className="w-full h-full"
                    controls
                    autoPlay
                    controlsList="nodownload"
                >
                    <source src={getImageUrl(movie.videoUrl || movie.video_url)} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Title Overlay (Optional, checking if user wants it clean or annotated) - keeping it clean for now like Netflix */}
        </div>
    );
};

export default VideoPlayerModal;
