// src/services/api.js
import axios from "axios";

// Tu API Key de TMDb (debes registrarte en https://www.themoviedb.org/settings/api)
const API_KEY = "d85cffbc8f63daf54f5d7603f22b8bbf"; 
const BASE_URL = "https://api.themoviedb.org/3";

// Crear una instancia de Axios para centralizar la configuración
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "es-ES", // Puedes cambiarlo a "en-US" si prefieres
  },
});

// Función para obtener películas populares
export const getPopularMovies = async () => {
  try {
    const response = await api.get("/movie/popular");
    return response.data.results;
  } catch (error) {
    console.error("Error al obtener películas populares:", error);
    return null;
  }
};

// Ejemplo de otra función para buscar películas por nombre
export const searchMovies = async (query) => {
  try {
    const response = await api.get("/search/movie", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar películas:", error);
    return null;
  }
};

// Obtener géneros disponibles
export const getGenres = async () => {
  try {
    const response = await api.get("/genre/movie/list");
    return response.data.genres; // Devuelve un array de géneros
  } catch (error) {
    console.error("Error al obtener géneros:", error);
    return [];
  }
};

// Obtener películas filtradas por género
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await api.get("/discover/movie", {
      params: {
        with_genres: genreId,
        page,
      },
    });
    return response.data.results; // Devuelve solo el array de películas
  } catch (error) {
    console.error(`Error al obtener películas del género ${genreId}:`, error);
    return [];
  }
};

// Obtener actores principales de una película
export const getMovieActors = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data.cast; // Devuelve los 5 primeros actores
  } catch (error) {
    console.error(`Error al obtener actores de la película ${movieId}:`, error);
    return [];
  }
};

//Obtener datos de pelicula por id
export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "release_dates,external_ids" // 👈 añadimos esto
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener detalles de la película ${movieId}:`, error);
    return null;
  }
};

//Obtener créditos de una pelicula
export const getMovieCredits = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=es-ES`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo créditos de la película:", error);
    return null;
  }
};

// Obtener detalles de un director/actor por ID
export const getPersonDetails = async (personId) => {
  try {
    const response = await api.get(`/person/${personId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos de la persona ${personId}:`, error);
    return null;
  }
};

// Obtener películas en las que ha participado (ya sea actor, director, etc.)
export const getPersonMovies = async (personId) => {
  try {
    const response = await api.get(`/person/${personId}/movie_credits`);
    return response.data.cast || [];
  } catch (error) {
    console.error(`Error al obtener películas de la persona ${personId}:`, error);
    return [];
  }
};

//obtener trailers
// Obtener trailers y videos de una película
export const getMovieVideos = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/videos`);
    return response.data.results; // Devuelve un array de videos
  } catch (error) {
    console.error(`Error al obtener videos de la película ${movieId}:`, error);
    return [];
  }
};

//obtener plataformas disponibles
export const getMovieProviders = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/watch/providers`, {
      params: { api_key: API_KEY },
    });
    return response.data.results || {};
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    return {};
  }
};

//obtener próximos estrenos
export const getUpcomingMovies = async (page = 1, region = "ES") => {
  try {
    const response = await api.get("/movie/upcoming", {
      params: { page, region },
    });

    return {
      results: response.data.results || [],
      totalPages: response.data.total_pages || 1,
    };
  } catch (error) {
    console.error("Error al obtener próximos estrenos:", error);
    return { results: [], totalPages: 1 };
  }
};


//obtener imagenes de peliculas
export const getMovieImages = async (movieId) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/movie/${movieId}/images`, {
      params: {
        api_key: API_KEY,
        include_image_language: "es,en,null",
      },
    });
    return data;
  } catch (error) {
    console.error("Error obteniendo imágenes de la película:", error);
    return { backdrops: [] };
  }
};