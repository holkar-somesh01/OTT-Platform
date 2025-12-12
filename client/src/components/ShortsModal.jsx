import { useState } from 'react';
import { X } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const ShortsModal = ({ isOpen, onClose, video }) => {
    if (!isOpen || !video) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
            >
                <X size={32} />
            </button>
            <div className="relative w-full max-w-[400px] aspect-[9/16] bg-black">
                <video
                    src={getImageUrl(video.videoUrl)}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    loop
                />
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-white font-bold text-lg">{video.title}</h3>
                    <p className="text-gray-200 text-sm line-clamp-2">{video.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ShortsModal;
