import axios from 'axios';

const fetchData = async () => {
  try {
    const response = await axios.post(
      'http://localhost:4000/graphql', // Endpoint de la API
      {
        query: `
          query {
            estaciones {
              id_estacion
              nombre_estacion
              latitud
              longitud
              direccion_del_viento
              intensidad_del_viento
              humedad
              temperatura
            }
          }
        `,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data.estaciones;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    throw error;
  }
};

const fetchGraphData = async (idEstacion,idfecha,limite) => {
  const response = await axios.post(
    'http://localhost:4000/graphql',
    {
      query: 
      `query {
          ultimasLecturas(id_estacion: ${idEstacion}, id_fecha:${idfecha}, limite:${limite}) {
          humedad {
          humedad
          momento
        }
        temperatura {
          temperatura
          momento
        }
      }
      }`
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.data.ultimasLecturas
}

export {fetchData, fetchGraphData };