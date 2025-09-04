import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getMovieDetails,
  getMovieActors,
  getMovieCredits,
  getMovieVideos,
  getMovieProviders,
} from "../../services/api";
import "./_movie.scss";
import Header from "../../components/header/Header";
import SearchBar from "../../components/searchBar/SearchBar";
import { PLATFORM_URLS_BY_NAME } from "../../services/platformLinks";
import DefaultImage from "../../assets/public/images/default.png";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";

const Movie = ({ genres }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [director, setDirector] = useState("");
  const [trailer, setTrailer] = useState([]);
  const [providers, setProviders] = useState([]);

  // Obtener datos de la película y actores
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieData = await getMovieDetails(id);
        setMovie(movieData);

        const cast = await getMovieActors(id);
        setActors(cast || []);

        const credits = await getMovieCredits(id);
        if (credits && credits.crew) {
          const directorInfo = credits.crew.find(
            (person) => person.job === "Director"
          );
          setDirector(directorInfo || null);
        } else {
          setDirector("Desconocido");
        }

        const videos = await getMovieVideos(id);
        // Filtrar solo los trailers de YouTube
        const trailer = videos.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailer(trailer || null);

        const provData = await getMovieProviders(id);
        const country = "ES"; // según tu país
        const streaming = provData[country]?.flatrate || [];
        setProviders(streaming);
        //console.log(streaming)
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-page loading">
        <p>Cargando datos de la película...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-page error">
        <p>No se encontraron datos para esta película.</p>
      </div>
    );
  }

  return (
    <>
      <Header genres={genres} />
      {/* Buscador de películas */}
      <SearchBar genres={genres} />
      <div className="movie-page">
        {/* Banner */}
        <div
          className="movie-banner"
          style={{
            backgroundImage: `url(${BASE_IMG_URL}${movie.backdrop_path})`,
          }}
        >
          <div className="overlay"></div>
          <div className="container">
            <div className="movie-info">
              {/* 
            <h1 className="movie-title title-page">{movie.title}</h1>
            {movie.tagline && (
              <p className="movie-tagline">"{movie.tagline}"</p>
            )}
            <p className="movie-rating title">
              ⭐ {movie.vote_average?.toFixed(1)}
            </p>
            <p className="movie-release paragraph">
              Estreno: {new Date(movie.release_date).toLocaleDateString()}
            </p>
            {movie.genres && (
              <p className="movie-genres paragraph">
                {movie.genres.map((g) => g.name).join(" • ")}
              </p>
            )}
            */}
            </div>
          </div>
        </div>

        {trailer && (
          <div className="trailer-section">
            <div className="container">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        {/* Contenido principal */}
        <div className="movie-content container">
          <div className="poster-container">
            <img
              src={`${BASE_IMG_URL}${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
          </div>

          <div className="movie-details">
            <h2 className="title-section text-light-grey">Sinopsis</h2>
            <p className="paragraph text-light-grey">
              {movie.overview || "No hay descripción disponible."}
            </p>
            <p className="title text-light-grey">
              Director:{" "}
              {director ? (
                <Link
                  to={`/person/${director.id}/${director.name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  className="link-director"
                >
                  {director.name}
                </Link>
              ) : (
                "Desconocido"
              )}
            </p>
            {providers.length > 0 && (
              <div className="streaming-providers">
                <p className="title text-light-grey">Disponible en:</p>
                <div className="providers-list">
                  {providers.map((provider) => {
                    let normalizedName = provider.provider_name
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/\s+/g, "");

                    if (normalizedName.includes("movistarplus")) {
                      normalizedName = "movistarplus+";
                    } else if (normalizedName.includes("amazon")) {
                      normalizedName = "primevideo";
                    }

                    const platformURL = PLATFORM_URLS_BY_NAME[normalizedName]
                      ? `${
                          PLATFORM_URLS_BY_NAME[normalizedName]
                        }${encodeURIComponent(movie.title)}`
                      : null;
                    console.log(PLATFORM_URLS_BY_NAME);
                    console.log("Provider original:", provider.provider_name);
                    console.log("Normalizado:", normalizedName);
                    console.log("URL generada:", platformURL);

                    return (
                      platformURL && (
                        <a
                          key={provider.provider_id}
                          href={platformURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-provider"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="provider-logo"
                          />
                        </a>
                      )
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {/* Actores */}
          {actors.length > 0 && (
            <div className="actors-section">
              <h3 className="title text-light-grey">Reparto</h3>
              <ul className="actors-list">
                {actors.map((actor) => (
                  <li key={actor.id} className="actor-item">
                    <Link
                      to={`/person/${actor.id}/${actor.name
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                      className="actor-link"
                    >
                      {actor.profile_path ? (
                        <img
                          src={`${BASE_IMG_URL}${actor.profile_path}`}
                          alt={actor.name}
                          className="actor-photo"
                        />
                      ) : (
                        <img
                          src={DefaultImage}
                          alt="default-actor"
                          className="actor-photo"
                        />
                      )}
                      <div>
                        <p className="paragraph text-light-grey">
                          {actor.name}
                        </p>
                        <p className="tooltip text-light-grey">
                          {actor.character}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Movie;
