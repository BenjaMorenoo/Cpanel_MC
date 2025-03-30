import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ServerProperties() {
  const [properties, setProperties] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:3000/get-server-properties');
        if (!response.ok) throw new Error('No se pudo cargar el archivo server.properties.');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProperties((prevProperties) => ({
      ...prevProperties,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/save-server-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(properties),
      });

      if (!response.ok) throw new Error('Error al guardar el archivo.');

      setMessage('¡Propiedades guardadas con éxito!');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Barra lateral */}
      <aside className="w-64 bg-gray-800 p-4">
        <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="text-lg hover:text-blue-400">
              Consola 📟
            </Link>
          </li>
          <li>
            <Link to="/upload_mods" className="text-lg hover:text-blue-400">
              Gestor de Mods 🛠
            </Link>
          </li>
          <li>
            <Link to="/server_properties" className="text-lg hover:text-blue-400">
              Propiedades Servidor ⚙️
            </Link>
          </li>
          <li>
              <Link to="/file_manager" className="text-lg hover:text-blue-400">
                 Gestor de Archivos 📂
              </Link>
          </li>      
        </ul>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <motion.h1 
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚙️ Modificar server.properties ⚙️
        </motion.h1>
        {message && <p className="text-center text-green-500">{message}</p>}
       

        {/* Contenedor de propiedades con scroll interno */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-5xl h-[500px] overflow-y-auto">
      
          
          {Object.keys(properties).length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(properties).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-lg mb-2">{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 text-white rounded-md"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">Cargando propiedades...</p>
          )}
        </div>
         {/* Botón siempre visible */}
         <div className="w-full max-w-5xl mb-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md sticky top-0 z-10"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServerProperties;
