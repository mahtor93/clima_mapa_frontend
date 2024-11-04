import "./App.css";
import React, { useState } from "react";
import Map from "./components/map/Map.jsx";
import Chart from "./components/graphs/Chart.jsx";
import { fetchGraphData } from "./api/api.js";
import { ResponsiveContainer } from "recharts";


function App() {
  const [transData, setTransData] = useState(null);
  const [nombreEstacionView, setNombreEstacionView] = useState("Seleccione una estación del mapa");
  const [idEstacion, setIdEstacion] = useState(null);
  const [temperatura, setTemperaturas] = useState([]);
  const [humedad, setHumedad] = useState([]);



  const getDatosGraficos = async (idEstacion,idFecha,limite) => {
    try {
        const data = await fetchGraphData(idEstacion,idFecha,limite);
        return data;
    } catch (error) {
        console.error("Error al obtener datos de gráficos", error);
        return null;
    }
};

const handleTransData = async (estacionId, nombreEstacion) => {

  console.log("ID de estación seleccionado:", estacionId); // Verifica el ID de estación
  console.log("Nombre de estación: ", nombreEstacion);
  const data = await getDatosGraficos(estacionId,13,15);
  if(data){
    console.log(data)
    setTransData(data);
    setNombreEstacionView(nombreEstacion);
    setTemperaturas(data.temperatura.reverse());
    setHumedad(data.humedad.reverse());
  } else {
    console.error("Datos no recibidos")
  }
};


  return (
    <>
      <Map onUpdateChartData={handleTransData} />
      <div className="mainContent">
        <h1>{nombreEstacionView}</h1>
          <div className="App-ChartContainer">
          <div className="flex-col">
            <h2>Temperatura °C</h2>
              <ResponsiveContainer width="100%" height="100%">
              <Chart data={temperatura} keyData={"temperatura"} />
              </ResponsiveContainer>
          </div>
          <div className="flex-col">
            <h2>Humedad %</h2>
            <ResponsiveContainer width="100%" height="100%">
            <Chart data={humedad} keyData={"humedad"} />
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
