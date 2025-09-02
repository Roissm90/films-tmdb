import React, { useEffect, useState } from 'react';
import { getDataPeople, getDataPlanets, getDataFilms, getDataSpecies, getDataVehicles, getDataStarships } from '../../services/api';

const MyComponent = () => {
  const [dataPeople, setDataPeople] = useState([]);
  const [dataPlanets, setDataPlanets] = useState([]);
  const [dataFilms, setDatafilms] = useState([]);
  const [dataSpecies, setDataspecies] = useState([]);
  const [dataVehicles, setDataVehicles] = useState([]);
  const [dataStarships, setDataStarships] = useState([]);

  useEffect(() => {
    getDataPeople().then(res => setDataPeople(res));
    getDataPlanets().then(res => setDataPlanets(res));
    getDataFilms().then(res => setDatafilms(res));
    getDataSpecies().then(res => setDataspecies(res));
    getDataVehicles().then(res => setDataVehicles(res));
    getDataStarships().then(res => setDataStarships(res));
  }, []);

  return (
    <div>
      <h2>Datos de la API Personajes:</h2>
      <pre>{JSON.stringify(dataPeople, null, 2)}</pre>
      <h2>Datos de la API Planetas:</h2>
      <pre>{JSON.stringify(dataPlanets, null, 2)}</pre>
      <h2>Datos de la API Películas:</h2>
      <pre>{JSON.stringify(dataFilms, null, 2)}</pre>
      <h2>Datos de la API Especies:</h2>
      <pre>{JSON.stringify(dataSpecies, null, 2)}</pre>
      <h2>Datos de la API Vehículos:</h2>
      <pre>{JSON.stringify(dataVehicles, null, 2)}</pre>
      <h2>Datos de la API Naves:</h2>
      <pre>{JSON.stringify(dataStarships, null, 2)}</pre>
    </div>
  );
};

export default MyComponent;
