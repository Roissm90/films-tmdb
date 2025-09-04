import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMoviesByGenre,
  getMovieActors,
  getMovieCredits,
} from "../../services/api";
import Header from "../../components/header/Header";
import SearchBar from "../../components/searchBar/SearchBar";
import "./_moviesByGenre.scss";
import DefaultImage from "../../assets/public/images/image_not_available.png"

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w300";

const MoviesByGenre = ({ genres }) => {
  const { genreId, genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const [actorsByMovie, setActorsByMovie] = useState({});
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isOverflow, setIsOverflow] = useState(true);
  const [director, setDirector] = useState("");

  // Traer películas por género
  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMoviesByGenre(genreId, page);
      if (data) {
        setMovies((prev) => (page === 1 ? data : [...prev, ...data]));
      }
    };
    fetchMovies();
  }, [genreId, page]);

  // Traer actores de las películas visibles
  useEffect(() => {
    const fetchActorsForMovies = async () => {
      const promises = movies.map(async (movie) => {
        const actors = await getMovieActors(movie.id);
        return { [movie.id]: actors };
      });
      const results = await Promise.all(promises);
      setActorsByMovie(Object.assign({}, ...results));
    };
    if (movies.length > 0) fetchActorsForMovies();
  }, [movies]);

  // Controlar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOverflow) {
      document.body.style.overflowY = "auto";
    } else {
      document.body.style.overflowY = "hidden";
    }
  }, [isOverflow]);

  const loadMore = () => setPage((prev) => prev + 1);

  const openModal = async (movie) => {
    setSelectedMovie(movie);
    setIsOverflow(false);

    // Traer créditos de la película para sacar el director
    const credits = await getMovieCredits(movie.id);
    if (credits && credits.crew) {
      const directorInfo = credits.crew.find(
        (person) => person.job === "Director"
      );
      setDirector(directorInfo || null);
    } else {
      setDirector("Desconocido");
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setDirector("");
    setIsOverflow(true);
  };

  return (
    <>
      <Header genres={genres} />
      <SearchBar genres={genres} />
      <div className="movies-page">
        <div className="container">
          <h1 className="title-page color-light-grey">
            {genreName.replace(/-/g, " ")}
          </h1>

          <div className="movies-grid">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => openModal(movie)}
              >
                <img
                  src={movie.poster_path ? `${BASE_IMG_URL}${movie.poster_path}` : DefaultImage}
                  alt={movie.title}
                  className="picture-movie"
                />
              </div>
            ))}
          </div>

          {movies.length > 0 && (
            <div className="pagination">
              <button
                onClick={loadMore}
                className="bg-custom-white text-dark-grey"
              >
                Cargar más
              </button>
            </div>
          )}

          {/* Modal */}
          <div
            className={`modal-overlay modal-movie ${
              selectedMovie ? "show" : ""
            }`}
            onClick={closeModal}
          >
            {selectedMovie && (
              <div
                className="modal-content bg-dark-grey"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="col-left">
                  <img
                    src={`${BASE_IMG_URL}${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="picture-movie"
                  />
                </div>
                <div className="col-right">
                  <Link
                    to={`/movie/${selectedMovie.id}/${selectedMovie.title}`}
                    className="title-link"
                    onClick={closeModal}
                  >
                    <h2 className="title text-light-blue">
                      {selectedMovie.title}
                    </h2>
                  </Link>

                  <p className="paragraph text-light-grey">
                    {selectedMovie.overview}
                  </p>
                  <p className="paragraph text-light-grey">
                    Nota: {selectedMovie.vote_average}
                  </p>
                  <p className="title text-light-grey">
                    Director:{" "}
                    {director ? (
                      <Link
                        to={`/director/${director.id}/${director.name
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`}
                        className="link-director text-light-blue"
                        onClick={closeModal}
                      >
                        {director.name}
                      </Link>
                    ) : (
                      "Desconocido"
                    )}
                  </p>
                </div>
                <button onClick={closeModal} className="close-modal">
                  <span className="line line-one bg-light-grey"></span>
                  <span className="line line-two bg-light-grey"></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviesByGenre;
