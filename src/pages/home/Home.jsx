import React from "react";
import SectionMovies from "../../components/sections/SectionsMovies";
import SearchBar from "../../components/searchBar/SearchBar";
import Header from "../../components/header/Header";

const Home = ({ moviesPopulars, moviesByGenre, genres, showHeader }) => {
  return (
    <>
    {/*
      <Header genres={genres} showHeader={showHeader}/>
      <SearchBar genres={genres} showHeader={showHeader}/>
    */}


      {/* Populares */}
      <SectionMovies title="Películas Populares" genres={genres}/>

      {/* Por género */}
      {genres.map((genre) => (
        <SectionMovies key={genre.id} title={genre.name} genreId={genre.id} genres={genres}/>
      ))}
    </>
  );
};

export default Home;
