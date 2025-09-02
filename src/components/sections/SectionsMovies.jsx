import React, { useEffect, useState } from "react";
import "./_sections.scss";
import {
  getMovieActors,
  getPopularMovies,
  getMoviesByGenre,
} from "../../services/api";
import { Link } from "react-router-dom";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

const SectionMovies = ({ title, genreId = null, genres = [], movies, onMovieClick }) => {
  const [currentMovies, setCurrentMovies] = useState(movies || []);
  const [actorsByMovie, setActorsByMovie] = useState({});
  const [page, setPage] = useState(1);
  const [visibleSlides, setVisibleSlides] = useState([]);

  // Cargar películas solo si no vienen desde props (búsqueda)
  useEffect(() => {
    if (movies && movies.length > 0) {
      setCurrentMovies(movies);
      return; // no hace fetch
    }

    const fetchMovies = async () => {
      const fetchedMovies = genreId
        ? await getMoviesByGenre(genreId, page)
        : await getPopularMovies(page);
      setCurrentMovies(fetchedMovies || []);
    };
    fetchMovies();
  }, [genreId, page, movies]);

  // Cargar actores de las películas visibles
  useEffect(() => {
    const fetchActorsForMovies = async () => {
      if (!currentMovies || currentMovies.length === 0) return;
      const promises = currentMovies.map(async (movie) => {
        const actors = await getMovieActors(movie.id);
        return { [movie.id]: actors };
      });
      const results = await Promise.all(promises);
      setActorsByMovie(Object.assign({}, ...results));
    };
    fetchActorsForMovies();
  }, [currentMovies]);

  // Hover delay de 600ms
  useEffect(() => {
    const movieCards = document.querySelectorAll(".swiper-slide");
    const timers = new Map();

    const handleMouseEnter = (e) => {
      const target = e.currentTarget;
      const timer = setTimeout(() => target.classList.add("hover"), 600);
      timers.set(target, timer);
    };

    const handleMouseLeave = (e) => {
      const target = e.currentTarget;
      clearTimeout(timers.get(target));
      target.classList.remove("hover");
      timers.delete(target);
    };

    movieCards.forEach((card) => {
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      movieCards.forEach((card) => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [currentMovies]);

  const renderMovie = (movie) => {
    const movieGenres = movie.genre_ids
      ?.map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean);

    return (
      <div className="movie">
        {movie.poster_path ? (
          <>
            <img
              src={`${BASE_IMG_URL}${movie.poster_path}`}
              alt={movie.title}
              className="picture-movie"
            />
            <div className="hide-info">
              <h3 className="title">{movie.title}</h3>
              {movieGenres?.length > 0 && (
                <p className="paragraph genres">{movieGenres.join(" • ")}</p>
              )}
              <p className="paragraph vote">Media: {movie.vote_average}</p>
            </div>
          </>
        ) : (
          <div>
            <span className="tooltip">Sin imagen</span>
          </div>
        )}
      </div>
    );
  };

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <section className="sctn-movies">
      <div className="container">
        <h2 className="title-section">{title}</h2>

        {!currentMovies || currentMovies.length === 0 ? (
          <p className="paragraph">No hay películas disponibles</p>
        ) : (
          <Swiper
            className="container-movies"
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={3.1}
            breakpoints={{
              576: { slidesPerView: 3.1 },
              768: { slidesPerView: 4.1 },
              1024: { slidesPerView: 5.1 },
              1440: { slidesPerView: 6.1 },
            }}
            onSwiper={(swiper) => {
              const perView = swiper.params.slidesPerView;
              const visibles = [];
              for (let i = 0; i < perView; i++) visibles.push(i);
              setVisibleSlides(visibles);
            }}
            onSlideChange={(swiper) => {
              let perView = swiper.params.slidesPerView;
              if (typeof perView === "object") {
                const width = window.innerWidth;
                const breakpoints = Object.keys(swiper.params.breakpoints)
                  .map((bp) => parseInt(bp))
                  .sort((a, b) => a - b);
                for (let bp of breakpoints) {
                  if (width >= bp)
                    perView = swiper.params.breakpoints[bp].slidesPerView;
                }
              }
              const visibles = [];
              for (let i = 0; i < perView; i++) {
                visibles.push(swiper.activeIndex + i);
              }
              setVisibleSlides(visibles);
            }}
          >
            {currentMovies.map((movie, index) => (
              <SwiperSlide
                key={movie.id}
                className={visibleSlides.includes(index) ? "is-visible" : ""}
              >
                <Link
                  to={`/movie/${movie.id}/${movie.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  onClick={onMovieClick}
                >
                  {renderMovie(movie)}
                </Link>
              </SwiperSlide>
            ))}

            {genreId && (
              <SwiperSlide className="">
                <Link
                  to={`/movies/genre/${genreId}/${genres
                    .find((g) => g.id === genreId)
                    ?.name.toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="movie see-more"
                  onClick={onMovieClick}
                >
                  <span className="title text-custom-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      role="img"
                      aria-labelledby="title"
                    >
                      <circle cx="32" cy="32" r="28" fill="#eee" />
                      <g
                        fill="none"
                        stroke="#111"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="20" y1="32" x2="42" y2="32" />
                        <polyline points="34,24 42,32 34,40" />
                      </g>
                    </svg>
                  </span>
                  <span className="title text-custom-white mobile">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 64 64"
                      role="img"
                      aria-labelledby="title"
                    >
                      <circle cx="32" cy="32" r="28" fill="#eee" />
                      <g
                        fill="none"
                        stroke="#111"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="20" y1="32" x2="42" y2="32" />
                        <polyline points="34,24 42,32 34,40" />
                      </g>
                    </svg>
                  </span>
                </Link>
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default SectionMovies;
