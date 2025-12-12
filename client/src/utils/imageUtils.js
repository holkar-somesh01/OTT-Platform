export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob')) return path;

    // Remove leading slash if present to avoid double slashes if base url has one
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Construct full URL
    return `${baseUrl}${cleanPath}`;
};
