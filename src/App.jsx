import Search from "./components/Search"
import Spinner from "./components/Spinner"
import MovieCard from "./components/MovieCard";

import { useEffect, useState } from 'react'
import { useDebounce } from "react-use";

import { updateSearchCount, getTrendingMovies } from "./appwrite";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    
    const [movies, setMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);

    const fetchMovies = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const endpoint = searchTerm
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Error Fetching Movies, Please try again later');
            }

            const data = await response.json();

            if(searchTerm && data.results.length > 0) {
                await updateSearchCount(searchTerm, data.results[0]);
            }

            if (data.response == 'error') {
                throw new Error(data.message);
            }

            setMovies(data.results || []);
        } catch (error) {
            console.error(error);
            setErrorMessage('Error Fetching Movies, Please try again later');
        } finally {
            setLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error(error);
        }
    }

    useDebounce(() => fetchMovies(), 1000, [searchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);


    const MovieList = () => {
        if (loading) {
            return <Spinner />
        }
        if (errorMessage) {
            return <p className="text-red-500">{errorMessage}</p>
        }
        return <ul>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </ul>
    }

    return (
        <main>
            <div className="pattern"></div>
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className="text-gradient">Movies</span> You&lsquo;ll enjoy without the hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index+1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>

                    <MovieList />
                </section>
            </div>
        </main>
    )
}

export default App