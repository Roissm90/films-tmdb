import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import "./_header.scss";
import IconWeb from "../../assets/public/images/iconWeb.png";

const Header = ({ genres, showHeader }) => {
  const [showGenres, setShowGenres] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleGenres = () => setShowGenres((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGenres(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isGenreRoute = location.pathname.startsWith("/movies/genre");
  const pathSegments = location.pathname.split("/");
  const currentGenreId = pathSegments[3];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : -148 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="header bg-custom-white"
    >
      <div className="container header-container">
        <div className="logo">
          <Link to="/" className="text-dark-grey title-page">
            <img className="icon-web" alt="icon web" src={IconWeb} />
          </Link>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active text-dark-grey title-section"
                    : "nav-link text-dark-grey title-section"
                }
              >
                Inicio
              </NavLink>
            </li>

            <li className="nav-link genres-dropdown" ref={dropdownRef}>
              <button
                onClick={toggleGenres}
                className={`nav-link text-dark-grey title-section toggle-button ${
                  isGenreRoute ? "active" : ""
                }`}
              >
                Géneros
              </button>

              <AnimatePresence>
                {showGenres && Array.isArray(genres) && genres.length > 0 && (
                  <motion.ul
                    className="genres-list bg-custom-black"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {genres.map((genre) => (
                      <li key={genre.id}>
                        <Link
                          to={`/movies/genre/${genre.id}/${genre.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className={`genre-link text-light-grey title ${
                            genre.id.toString() === currentGenreId ? "active" : ""
                          }`}
                          onClick={() => setShowGenres(false)}
                        >
                          {genre.name}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
