import React from 'react';

// Base Skeleton Element
const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-700/50 rounded ${className}`} />
);

export const BannerSkeleton = () => (
    <div className="relative h-[80vh] w-full bg-gray-900 animate-pulse">
        <div className="absolute top-[35%] px-4 sm:px-12 w-full space-y-4">
            <Skeleton className="h-12 w-3/4 md:w-1/3" />
            <Skeleton className="h-24 w-full md:w-1/2" />
            <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
            </div>
        </div>
    </div>
);

export const RowSkeleton = ({ isLargeRow }) => (
    <div className="pl-4 sm:pl-12 my-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <Skeleton
                    key={i}
                    className={`flex-none rounded-md ${isLargeRow ? "w-[160px] md:w-[200px] h-[240px] md:h-[300px]" : "w-[240px] md:w-[280px] h-[135px] md:h-[160px]"
                        }`}
                />
            ))}
        </div>
    </div>
);

export const CardSkeleton = () => (
    <div className="bg-secondary rounded-xl p-6 border border-gray-800 space-y-4">
        <div className="flex justify-between items-start">
            <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-32" />
    </div>
);

export const TableSkeleton = () => (
    <div className="bg-secondary rounded-xl border border-gray-800 p-4">
        <div className="mb-6 flex gap-4">
            <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="space-y-4">
            <div className="flex gap-4 border-b border-gray-700 pb-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-1/5" />
                ))}
            </div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                    {[...Array(5)].map((_, j) => (
                        <Skeleton key={j} className="h-12 w-1/5" />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export const GridSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="aspect-[9/16] rounded-xl" />
        ))}
    </div>
);

export default Skeleton;
