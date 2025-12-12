import { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Upload, Film, Image } from 'lucide-react';
import { useAddMovieMutation, useGetMoviesQuery, useUpdateMovieMutation, useDeleteMovieMutation } from '../../store/api';
import { getImageUrl } from '../../utils/imageUtils';
import { TableSkeleton } from '../../components/Skeleton';
import DataTable from '../../components/DataTable';

const AdminContent = () => {
    const [showModal, setShowModal] = useState(false);
    // const [searchTerm, setSearchTerm] = useState(''); // Handled by DataTable now
    const [editingMovie, setEditingMovie] = useState(null);

    const [tableParams, setTableParams] = useState({
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const [addMovie, { isLoading: isAdding }] = useAddMovieMutation();
    const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();
    const [deleteMovie] = useDeleteMovieMutation();
    // Pass tableParams to query
    const { data: movies = [], isLoading: isFetchingMovies } = useGetMoviesQuery(tableParams);

    const [formData, setFormData] = useState({
        title: '',
        genre: 'Action',
        description: '',
        releaseYear: new Date().getFullYear(),
        type: 'movie',
        category: 'Trending Now'
    });

    const [posterFile, setPosterFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const posterInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'poster') setPosterFile(file);
            if (type === 'video') setVideoFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (type === 'poster') setPosterFile(file);
            if (type === 'video') setVideoFile(file);
        }
    };

    const openModal = (movie = null) => {
        if (movie) {
            setEditingMovie(movie);
            setFormData({
                title: movie.title,
                genre: movie.genre,
                description: movie.description,
                releaseYear: movie.releaseYear,
                type: movie.type || 'movie',
                category: movie.category || 'Trending Now'
            });
        } else {
            setEditingMovie(null);
            setFormData({
                title: '',
                genre: 'Action',
                description: '',
                releaseYear: new Date().getFullYear(),
                type: 'movie',
                category: 'Trending Now'
            });
            setPosterFile(null);
            setVideoFile(null);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('genre', formData.genre);
            data.append('description', formData.description);
            data.append('releaseYear', formData.releaseYear);
            data.append('type', formData.type || 'movie');
            data.append('category', formData.category || 'Trending Now');

            if (posterFile) data.append('poster', posterFile);
            if (videoFile) data.append('video', videoFile);

            if (editingMovie) {
                await updateMovie({ id: editingMovie.id, data }).unwrap();
                alert('Content updated successfully!');
            } else {
                await addMovie(data).unwrap();
                alert('Content added successfully!');
            }

            setShowModal(false);
            setEditingMovie(null);
            setPosterFile(null);
            setVideoFile(null);
            setFormData({ title: '', genre: 'Action', description: '', releaseYear: new Date().getFullYear() });
        } catch (error) {
            console.error('Failed to save movie:', error);
            alert('Failed to save movie');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            try {
                await deleteMovie(id).unwrap();
            } catch (error) {
                console.error('Failed to delete movie:', error);
                alert('Failed to delete movie');
            }
        }
    };

    const columns = [
        {
            header: "Poster",
            accessor: "poster",
            render: (movie) => (
                <img
                    src={getImageUrl(movie.poster_path || movie.posterUrl)}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                />
            )
        },
        { header: "Title", accessor: "title", sortable: true },
        { header: "Genre", accessor: "genre", sortable: true },
        { header: "Release Year", accessor: "releaseYear", sortable: true },
        {
            header: "Actions",
            accessor: "actions",
            render: (movie) => (
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                        onClick={() => openModal(movie)}
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                        onClick={() => handleDelete(movie.id)}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    const Actions = () => (
        <button
            onClick={() => openModal()}
            className="btn bg-accent hover:bg-accent-hover text-white flex items-center gap-2"
        >
            <Plus size={20} />
            Add New Content
        </button>
    );

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Content Library</h2>

            {isFetchingMovies ? (
                <TableSkeleton />
            ) : (
                <DataTable
                    columns={columns}
                    data={movies.data || movies}
                    meta={movies.meta}
                    searchKeys={['title', 'genre']}
                    searchPlaceholder="Search movies..."
                    actions={<Actions />}
                    serverSide
                    onServerRequest={(params) => {
                        setTableParams(prev => ({ ...prev, ...params }));
                    }}
                />
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
                    <div className="bg-secondary rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-secondary z-10">
                            <h3 className="text-xl font-bold">{editingMovie ? 'Edit Content' : 'Add New Content'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-primary-text">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        className="w-full bg-primary border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent text-primary-text"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g. The Matrix"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary">Genre</label>
                                    <select
                                        name="genre"
                                        className="w-full bg-primary border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent appearance-none text-primary-text"
                                        value={formData.genre}
                                        onChange={handleInputChange}
                                    >
                                        <option>Action</option>
                                        <option>Comedy</option>
                                        <option>Drama</option>
                                        <option>Sci-Fi</option>
                                        <option>Horror</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary">Type</label>
                                    <select
                                        name="type"
                                        className="w-full bg-primary border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent appearance-none text-primary-text"
                                        value={formData.type || 'movie'}
                                        onChange={handleInputChange}
                                    >
                                        <option value="movie">Movie</option>
                                        <option value="series">Series</option>
                                        <option value="short">Short</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary">Category</label>
                                    <select
                                        name="category"
                                        className="w-full bg-primary border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent appearance-none text-primary-text"
                                        value={formData.category || 'Trending Now'}
                                        onChange={handleInputChange}
                                    >
                                        <option>Trending Now</option>
                                        <option>Top Rated</option>
                                        <option>Action Thrillers</option>
                                        <option>Sci-Fi & Fantasy</option>
                                        <option>Award Winning</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-text-secondary">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    className="w-full h-32 bg-primary border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent resize-none text-primary-text"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter movie synopsis..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Poster Upload */}
                                <div
                                    className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer group relative"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, 'poster')}
                                    onClick={() => posterInputRef.current.click()}
                                >
                                    <input
                                        type="file"
                                        ref={posterInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'poster')}
                                    />
                                    <Image size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">
                                        {posterFile ? posterFile.name : (editingMovie ? "Change Poster (Optional)" : "Upload Poster")}
                                    </span>
                                    <span className="text-xs text-text-secondary mt-1">
                                        {editingMovie && !posterFile ? "Current poster preserved" : "JPG, PNG (Max 5MB)"}
                                    </span>
                                </div>

                                {/* Video Upload */}
                                <div
                                    className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer group relative"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, 'video')}
                                    onClick={() => videoInputRef.current.click()}
                                >
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        className="hidden"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e, 'video')}
                                    />
                                    <Film size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">
                                        {videoFile ? videoFile.name : (editingMovie ? "Change Video (Optional)" : "Upload Trailer/Video")}
                                    </span>
                                    <span className="text-xs text-text-secondary mt-1">
                                        {editingMovie && !videoFile ? "Current video preserved" : "MP4, WEBM (Max 500MB)"}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-6 flex justify-end gap-3 main-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-hover transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors font-medium"
                                    disabled={isAdding || isUpdating}
                                >
                                    {isAdding || isUpdating ? 'Saving...' : 'Save Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default AdminContent;
