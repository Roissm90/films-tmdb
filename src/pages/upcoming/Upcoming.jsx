import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUpcomingMovies } from "../../services/api";
import "./_upcoming.scss";
import DefaultImage from "../../assets/public/images/image_not_available.png"

const Upcoming = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Ordenar películas por fecha de estreno
  const sortMoviesByDate = (moviesList) => {
    return moviesList.sort(
      (a, b) => new Date(a.release_date) - new Date(b.release_date)
    );
  };

  // Agrupar películas por fecha de estreno
  const groupMoviesByDate = (moviesList) => {
    return moviesList.reduce((groups, movie) => {
      const date = movie.release_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(movie);
      return groups;
    }, {});
  };

  // Formatear fecha en español
  const formatDate = (date) => {
    const formatted = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(date));

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Cargar estrenos iniciales
  useEffect(() => {
    const fetchInitialMovies = async () => {
      setLoading(true);
      const data = await getUpcomingMovies(1, "ES");

      const sorted = sortMoviesByDate(data.results);
      setMovies(sorted);
      setTotalPages(data.total_pages);
      setLoading(false);
    };

    fetchInitialMovies();
  }, []);

  // Cargar más estrenos
  const loadMoreMovies = async () => {
    if (page >= totalPages) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const data = await getUpcomingMovies(nextPage, "ES");

    const combined = [...movies, ...data.results];
    const sorted = sortMoviesByDate(combined);

    setMovies(sorted);
    setPage(nextPage);
    setLoadingMore(false);
  };

  if (loading) return <p>Cargando próximos estrenos...</p>;

  // Agrupamos las películas por fecha de estreno
  const groupedMovies = groupMoviesByDate(movies);

  return (
    <div className="upcoming-page">
      <div className="container">
        <h1 className="title-section text-light-grey">Próximos estrenos</h1>

        {/* Renderizamos un bloque por cada fecha */}
        {Object.keys(groupedMovies).map((date) => (
          <div key={date} className="release-block">
            <h2 className="release-date title-section text-light-grey">
              {formatDate(date)}
            </h2>
            <div className="movies-grid">
              {groupedMovies[date].map((movie) => (
                <Link
                  to={`/movie/${movie.id}/${movie.title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  key={movie.id}
                  className="movie-card"
                >
                  <h2 className="title text-light-grey">{movie.title}</h2>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : DefaultImage
                    }
                    alt={movie.title}
                    className="picture-movie"
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Botón "Ver más" */}
        {page < totalPages && (
          <div className="load-more">
            <button onClick={loadMoreMovies} disabled={loadingMore}>
              {loadingMore ? "Cargando..." : "Ver más"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
