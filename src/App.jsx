import { useScrollDirection } from "react-use-scroll-direction";
import React, { useEffect, useState, useRef } from "react";
import Home from "./pages/home/Home";
import { getPopularMovies, getGenres, getMoviesByGenre } from "./services/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoviesByGenre from "./pages/moviesByGenre/MoviesByGenre";
import Movie from "./pages/movie/Movie";
import Header from "./components/header/Header";
import SearchBar from "./components/searchBar/SearchBar";
import Person from "./pages/person/Person";

function App() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const { isScrollingUp, isScrollingDown } = useScrollDirection();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    if (window.scrollY === 0) {
      setShowHeader(true);
      //console.log(window.scrollY)
      return;
    }
    if (isScrollingDown && showHeader) setShowHeader(false);
    else if (isScrollingUp && !showHeader) setShowHeader(true);
  }, [isScrollingUp, isScrollingDown]);

  // Fetch data...
  useEffect(() => {
    const fetchMoviesPopulars = async () => {
      const data = await getPopularMovies();
      if (data?.results) setPopularMovies(data.results);
    };
    fetchMoviesPopulars();
  }, []);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      const genresData = await getGenres();
      setGenres(genresData);

      const movies = {};
      for (const genre of genresData) {
        movies[genre.name] = await getMoviesByGenre(genre.id);
      }
      setMoviesByGenre(movies);
    };
    fetchMoviesByGenre();
  }, []);

  return (
    <Router>
      {/* Header y SearchBar fuera de Routes para que estén en todas las rutas */}
      <Header genres={genres} showHeader={showHeader} />
      <SearchBar genres={genres} showHeader={showHeader} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              moviesPopulars={popularMovies}
              genres={genres}
              moviesByGenre={moviesByGenre}
            />
          }
        />
        <Route
          path="/movies/genre/:genreId/:genreName"
          element={<MoviesByGenre genres={genres} />}
        />
        <Route path="/movie/:id/:title" element={<Movie genres={genres} />} />
        <Route
          path="/person/:personId/:personName"
          element={<Person genres={genres} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
