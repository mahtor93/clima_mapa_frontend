/* 'https://services5.arcgis.com/i7S5PSnIJAUcWvSE/ArcGIS/rest/services/Amenaza_por_Incendio_Forestal/FeatureServer/0/query?f=geojson&where=1%3D1' */

import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { fetchData, fetchGraphData } from '../../api/api.js';

const Map = ({ onUpdateChartData }) => {
    const [estaciones, setEstaciones] = useState([]);
    const [selectedEstacionId, setSelectedEstacionId] = useState(null);
    const [selectedNombreEstacion, setSelectedNombreEstacion] = useState(null);

    const [geoJsonData, setGeoJsonData] = useState(null);
    const [geoJsonDataTwo, setGeoJsonDataTwo] = useState(null);
    const mapRef = useRef(null);
    const latitude = -36.75254225837269;
    const longitude = -73.06482943684635;


    const createRotatingIcon = (angle) => {

        const iconDiv = L.divIcon({
            className: 'rotating-icon',
            html: `<div style="transform: rotate(${angle}deg); transition: transform 0.3s;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                        <img src="/markers/arrow-up.png" style="width: 20px; height: 20px;" />
                        <div style="display:flex;flex-direction:row;justify-content:center;">
                        <img src="/markers/arrow-up.png" style="width: 20px; height: 20px;" />
                        <img src="/markers/arrow-up.png" style="width: 20px; height: 20px;" />
                        </div>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32], // Punto de anclaje del icono
            popupAnchor: [0, -32], // Ajustar el popup
        });

        return iconDiv;
    };

    const getColorByGridcode = (gridcode) => {
        switch (gridcode) {
            case 1: return 'green';
            case 2: return '#A2FF00';
            case 3: return 'orange';
            case 4: return '#FF5E00';
            case 5: return 'red';
            case 6: return 'purple';
            default: return 'gray'; // Color por defecto para otros valores
        }
    };
    
    const styleByGridcode = (feature) => {
        return {
            color: getColorByGridcode(feature.properties.gridcode),
            weight: 2,
            opacity: 1,
        };
    };

    useEffect(() => {
        const getEstaciones = async () => {
            try {
                const data = await fetchData();
                if (data) setEstaciones(data);
                console.log(data)
            } catch (error) {
                console.error("Error al obtener estaciones: ", error);
            }
        };


        const getGeoJSON = async () => {
            try { /* https://services5.arcgis.com/i7S5PSnIJAUcWvSE/ArcGIS/rest/services/Amenaza_por_Incendio_Forestal/FeatureServer/0/query?f=geojson&where=1%3D1&resultOffset=4000&resultRecordCount=4000 */
                
                //--------const resPartOne = await axios.get('https://services5.arcgis.com/i7S5PSnIJAUcWvSE/ArcGIS/rest/services/Amenaza_por_Incendio_Forestal/FeatureServer/0/query?f=geojson&where=1%3D1&');
                // const resPartOne = await axios.get('https://services5.arcgis.com/i7S5PSnIJAUcWvSE/ArcGIS/rest/services/Amenaza_por_Incendio_Forestal/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&resultOffset=0&resultRecordCount=4000');

                //--------const resPartTwo = await axios.get('https://services5.arcgis.com/i7S5PSnIJAUcWvSE/ArcGIS/rest/services/Amenaza_por_Incendio_Forestal/FeatureServer/0/query?f=geojson&where=1%3D1&resultOffset=4000&resultRecordCount=4000');
                // const resPartTwo = await axios.get('https://services5.arcgis.com/i7S5PSnIJAUcWvSE/ArcGIS/rest/services/Amenaza_por_Incendio_Forestal/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&resultOffset=4000&resultRecordCount=4000');
                
                // setGeoJsonData(resPartOne.data); // Almacena el GeoJSON
                // setGeoJsonDataTwo(resPartTwo.data); // Almacena el GeoJSON
            } catch (error) {
                console.error("Error al obtener GeoJSON: ", error);
            }
        };

        getEstaciones();
        getGeoJSON();
    }, []);

    return (
        <>
            <MapContainer
                center={[latitude, longitude]}
                zoom={12}
                ref={mapRef}
                style={{ height: "50vh", width: "100%" }}>
                <TileLayer
                /* 'https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=4yY1WWgxJvfahlZk0lrxuX7ZJKw8XpoCZ56DIxz9fZtWSrUEQQAXRU4xK6t8d3yu' 
                    attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                */
                    url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
                {estaciones.map((estacion, index) => {
                    const angle = estacion.direccion_del_viento; // Grado de rotación
                    const rotatingIcon = createRotatingIcon(angle); // Crear el icono rotatorio

                    return (
                        <Marker
                            key={index}
                            position={[estacion.latitud, estacion.longitud]}
                            icon={rotatingIcon}
                            eventHandlers={{
                                click: () => {
                                    const idEstacion = estacion.id_estacion; // Obtiene el ID de estación directamente
                                    const estacionNombre = estacion.nombre_estacion;
                                    if (idEstacion) { // Verifica que el ID no sea undefined
                                        setSelectedEstacionId(idEstacion); // Actualiza el estado
                                        setSelectedNombreEstacion(estacionNombre);
                                        onUpdateChartData(idEstacion, estacionNombre);
                                         // Llama a la función con el ID correcto
                                    } else {
                                        console.error("ID de estación no válido");
                                    }
                                }
                            }}
                        >
                            <Popup>
                                <b>{estacion.nombre_estacion}</b>
                                <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                                    <li>Temperatura: {estacion.temperatura}°C</li>
                                    <li>Humedad: {estacion.humedad}%</li>
                                    <li>Intensidad del viento: {estacion.intensidad_del_viento} km/h</li>
                                </ul>
                            </Popup>
                        </Marker>
                    );
                })}
                {geoJsonData && <GeoJSON data={geoJsonData} style={styleByGridcode}  />}
                {geoJsonDataTwo && <GeoJSON data={geoJsonDataTwo} style={styleByGridcode}  />}
            </MapContainer>
        </>
    )
}


export default Map;