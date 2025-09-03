import { useState, useRef, useEffect } from "react";
import { searchMovies } from "../../services/api";
import { motion } from "framer-motion";
import SectionMovies from "../sections/SectionsMovies";
import "./_finder.scss";

const SearchBar = ({ genres, showHeader }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noResults, setNoResults] = useState(false);

  const containerRef = useRef(null); // 👈 ref del contenedor

  //console.log(showHeader);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Introduce un nombre válido.");
      setResults([]);
      setNoResults(false);
      return;
    }

    setLoading(true);
    setError("");
    setNoResults(false);

    try {
      const data = await searchMovies(query);

      if (data && data.results.length > 0) {
        setResults(data.results);
      } else {
        setResults([]);
        setNoResults(true);
      }
    } catch (err) {
      console.error("Error al buscar:", err);
      setError("Hubo un problema al buscar películas.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError("");
    setNoResults(false);
  };

  // Cerrar search al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleClear(); // 👈 resetea todo
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="search-bar-container bg-custom-white"
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : -148 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container">
        {/* Formulario de búsqueda */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            placeholder="Buscar película..."
            onChange={(e) => setQuery(e.target.value)}
            className="search-input text-light-grey bg-custom-black title"
            id="searchInput"
          />

          <button type="submit" className="search-button">
            Buscar
          </button>

          {/* Botón de limpiar, solo aparece si hay texto */}
          {results.length > 0 && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Borrar búsqueda"
            >
              <span className="line line-one"></span>
              <span className="line line-two"></span>
            </button>
          )}
        </form>

        {/* Mensajes */}
        {loading && <p className="loading-text">Buscando películas...</p>}
        {error && <p className="error-text">{error}</p>}
        {noResults && <p className="error-text">No se encontraron películas.</p>}

        {/* Resultados */}
        {results.length > 0 && (
          <SectionMovies
            title="Resultados de la búsqueda"
            movies={results}
            genres={genres}
            onMovieClick={handleClear}
          />
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
