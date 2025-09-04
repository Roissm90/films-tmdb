import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getMovieDetails,
  getMovieActors,
  getMovieCredits,
  getMovieVideos,
  getMovieProviders,
  getMovieImages,
} from "../../services/api";
import "./_movie.scss";
import Header from "../../components/header/Header";
import SearchBar from "../../components/searchBar/SearchBar";
import GalleryFull from "../../components/galleryFull/GalleryFull";
import { PLATFORM_URLS_BY_NAME } from "../../services/platformLinks";
import DefaultImage from "../../assets/public/images/default.png"

const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";

const Movie = ({ genres }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [director, setDirector] = useState("");
  const [trailer, setTrailer] = useState([]);
  const [providers, setProviders] = useState([]);
  const [certification, setCertification] = useState("No disponible");
  const [images, setImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieData = await getMovieDetails(id);
        setMovie(movieData);

        const cert =
          movieData.release_dates?.results?.find((c) => c.iso_3166_1 === "ES")
            ?.release_dates[0]?.certification || "No disponible";
        setCertification(cert);

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
        const trailer = videos.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailer(trailer || null);

        const provData = await getMovieProviders(id);
        const country = "ES";
        const streaming = provData[country]?.flatrate || [];
        setProviders(streaming);

        const imagesData = await getMovieImages(id);

        const filteredImages = imagesData.backdrops.filter(
          (img) =>
            img.file_path !== movieData.backdrop_path &&
            img.file_path !== movieData.poster_path
        );

        setImages(filteredImages);
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
      <SearchBar genres={genres} />
      <div className="movie-page">
        <div
          className="movie-banner"
          style={{
            backgroundImage: `url(${BASE_IMG_URL}${movie.backdrop_path})`,
          }}
        >
          <div className="overlay"></div>
          <div className="container">
            <div className="movie-info"></div>
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

        <div className="movie-content container">
          <div className="poster-container">
            <img
              src={`${BASE_IMG_URL}${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
          </div>

          <div className="movie-details">
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
            {movie.runtime && (
              <p className="paragraph text-light-grey center-vertical min-gap">
                <span className="title-page no-margin">⏱</span> {movie.runtime}{" "}
                min
              </p>
            )}
            {certification !== "No diponible" && (
              <p className="paragraph text-light-grey">
                No recomendada para menores de {certification} años
              </p>
            )}

            {movie.external_ids?.imdb_id && (
              <p className="paragraph text-light-grey">
                <a
                  href={`https://www.imdb.com/title/${movie.external_ids.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-imdb"
                >
                  <svg
                    id="home_img"
                    className="ipc-logo"
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="32"
                    viewBox="0 0 64 32"
                    version="1.1"
                  >
                    <g fill="#F5C518">
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx="4"
                      ></rect>
                    </g>
                    <g
                      transform="translate(8.000000, 7.000000)"
                      fill="#000000"
                      fillRule="nonzero"
                    >
                      <polygon points="0 18 5 18 5 0 0 0"></polygon>
                      <path d="M15.6725178,0 L14.5534833,8.40846934 L13.8582008,3.83502426 C13.65661,2.37009263 13.4632474,1.09175121 13.278113,0 L7,0 L7,18 L11.2416347,18 L11.2580911,6.11380679 L13.0436094,18 L16.0633571,18 L17.7583653,5.8517865 L17.7707076,18 L22,18 L22,0 L15.6725178,0 Z"></path>
                      <path d="M24,18 L24,0 L31.8045586,0 C33.5693522,0 35,1.41994415 35,3.17660424 L35,14.8233958 C35,16.5777858 33.5716617,18 31.8045586,18 L24,18 Z M29.8322479,3.2395236 C29.6339219,3.13233348 29.2545158,3.08072342 28.7026524,3.08072342 L28.7026524,14.8914865 C29.4312846,14.8914865 29.8796736,14.7604764 30.0478195,14.4865461 C30.2159654,14.2165858 30.3021941,13.486105 30.3021941,12.2871637 L30.3021941,5.3078959 C30.3021941,4.49404499 30.272014,3.97397442 30.2159654,3.74371416 C30.1599168,3.5134539 30.0348852,3.34671372 29.8322479,3.2395236 Z"></path>
                      <path d="M44.4299079,4.50685823 L44.749518,4.50685823 C46.5447098,4.50685823 48,5.91267586 48,7.64486762 L48,14.8619906 C48,16.5950653 46.5451816,18 44.749518,18 L44.4299079,18 C43.3314617,18 42.3602746,17.4736618 41.7718697,16.6682739 L41.4838962,17.7687785 L37,17.7687785 L37,0 L41.7843263,0 L41.7843263,5.78053556 C42.4024982,5.01015739 43.3551514,4.50685823 44.4299079,4.50685823 Z M43.4055679,13.2842155 L43.4055679,9.01907814 C43.4055679,8.31433946 43.3603268,7.85185468 43.2660746,7.63896485 C43.1718224,7.42607505 42.7955881,7.2893916 42.5316822,7.2893916 C42.267776,7.2893916 41.8607934,7.40047379 41.7816216,7.58767002 L41.7816216,9.01907814 L41.7816216,13.4207851 L41.7816216,14.8074788 C41.8721037,15.0130276 42.2602358,15.1274059 42.5316822,15.1274059 C42.8031285,15.1274059 43.1982131,15.0166981 43.281155,14.8074788 C43.3640968,14.5982595 43.4055679,14.0880581 43.4055679,13.2842155 Z"></path>
                    </g>
                  </svg>
                </a>
              </p>
            )}

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

            {images.length > 0 && (
              <>
                <a
                  className="text-light-grey paragraph image-gallery-link"
                  onClick={() => setShowGallery(true)}
                >
                  Ver imágenes
                </a>
                <GalleryFull images={images} visible={showGallery} onClose={() => setShowGallery(false)}/>
              </>
            )}
          </div>

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
