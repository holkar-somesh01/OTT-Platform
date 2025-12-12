export const requests = {
    fetchTrending: '/trending/all/week',
    fetchNetflixOriginals: '/discover/tv?with_networks=213',
    fetchTopRated: '/movie/top_rated',
    fetchActionMovies: '/discover/movie?with_genres=28',
    fetchComedyMovies: '/discover/movie?with_genres=35',
    fetchHorrorMovies: '/discover/movie?with_genres=27',
    fetchRomanceMovies: '/discover/movie?with_genres=10749',
    fetchDocumentaries: '/discover/movie?with_genres=99',
};

// Since we don't have a real backend proxy for TMDB yet, we will use static mock data for the demo
export const movies = [
    {
        id: 1,
        title: "Stranger Things",
        overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
        backdrop_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop",
        poster_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop",
        isLarge: true
    },
    {
        id: 2,
        title: "The Witcher",
        overview: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
        backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop",
        poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop",
        isLarge: true
    },
    {
        id: 3,
        title: "Inception",
        overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        backdrop_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2670&auto=format&fit=crop",
        poster_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Interstellar",
        overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        backdrop_path: "https://images.unsplash.com/photo-1462331940958-3864c1d87f59?q=80&w=2669&auto=format&fit=crop",
        poster_path: "https://images.unsplash.com/photo-1462331940958-3864c1d87f59?w=500&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Dark",
        overview: "A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.",
        backdrop_path: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2668&auto=format&fit=crop",
        poster_path: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?w=500&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Breaking Bad",
        overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        backdrop_path: "https://images.unsplash.com/photo-1590133320600-fa263439b1e9?q=80&w=2670&auto=format&fit=crop",
        poster_path: "https://images.unsplash.com/photo-1590133320600-fa263439b1e9?w=500&auto=format&fit=crop"
    },
    {
        id: 7,
        title: "Avatar",
        overview: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
        backdrop_path: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=2628&auto=format&fit=crop",
        poster_path: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&auto=format&fit=crop"
    },
    {
        id: 8,
        title: "The Matrix",
        overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        backdrop_path: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop",
        poster_path: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop"
    }
];

export const heroMovie = movies[0];
