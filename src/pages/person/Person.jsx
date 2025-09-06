import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPersonDetails, getPersonMovies } from "../../services/api";
import Header from "../../components/header/Header";
import SearchBar from "../../components/searchBar/SearchBar";
import DefaultImage from "../../assets/public/images/image_not_available.png";
import "./_person.scss";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w300";

const Person = ({ genres }) => {
  const { personId } = useParams();
  const [director, setDirector] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectorData = async () => {
      setLoading(true);
      try {
        const personData = await getPersonDetails(personId);
        setDirector(personData);
        console.log(personData)

        const personMovies = await getPersonMovies(personId);
        setMovies(personMovies || []);
      } catch (error) {
        console.error("Error cargando datos del director:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorData();
  }, [personId]);

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="director-page loading">
        {director?.known_for_department === "Directing" ? (
          <p>Cargando información del director...</p>
        ) : (
          <p>
            Cargando información{" "}
            {director?.gender === 1 ? "de la actriz..." : "del actor..."}
          </p>
        )}
      </div>
    );
  }

  // No se encontró información
  if (!director) {
    return (
      <div className="director-page error">
        <p>No se encontró información</p>
      </div>
    );
  }

  return (
    <>
      <Header genres={genres} />
      <SearchBar genres={genres} />
      <section className="director-page">
        <div className="container">
          <div className="director-header">
            <img
              src={
                director?.profile_path
                  ? `${BASE_IMG_URL}${director.profile_path}`
                  : DefaultImage
              }
              alt={director?.name || "Sin nombre"}
              className="director-photo"
            />
            <div className="director-info">
              <h1 className="title-page text-light-grey">{director?.name}</h1>
              <p className="paragraph text-light-grey">
                Fecha de nacimiento: {director?.birthday || "-"}
              </p>
              <p className="paragraph text-light-grey">
                Lugar de nacimiento: {director?.place_of_birth || "-"}
              </p>
              {director?.biography && (
                <p className="paragraph text-light-grey">{director.biography}</p>
              )}
            </div>
          </div>

          <div className="movies-section">
            <h2 className="title-section text-light-grey">
              {director?.known_for_department === "Directing"
                ? "Películas dirigidas"
                : "Películas"}
            </h2>
            <div className="movies-grid">
              {movies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}/${movie.title}`}
                  className="movie-card"
                >
                  <img
                    src={
                      movie?.poster_path
                        ? `${BASE_IMG_URL}${movie.poster_path}`
                        : DefaultImage
                    }
                    alt={movie?.title || "Sin título"}
                    className="picture-movie"
                  />
                  <p className="title text-light-grey">{movie?.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Person;
