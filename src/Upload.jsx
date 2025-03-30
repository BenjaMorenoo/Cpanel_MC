import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modsList, setModsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modToDelete, setModToDelete] = useState('');

  useEffect(() => {
    const fetchMods = async () => {
      try {
        const response = await fetch('http://localhost:3000/get-mods');
        if (!response.ok) throw new Error('Error al obtener los mods.');
        const data = await response.json();
        setModsList(data);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchMods();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setMessage('No se ha seleccionado ningún archivo.');
      return;
    }

    if (!selectedFile.name.endsWith('.jar')) {
      setMessage('Solo se permiten archivos con extensión .jar.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB límite
      setMessage('El archivo es demasiado grande (máximo 10MB).');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      setMessage('Por favor, selecciona un archivo primero.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/uploadmods', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error en la subida.');

      setMessage(`Archivo ${result.filename} subido con éxito.`);
      setModsList((prevMods) => [...prevMods, result.filename]);
      setFile(null);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  const handleDeleteConfirmation = (mod) => {
    setModToDelete(mod);
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(async () => {
    if (!modToDelete) return;

    try {
      const response = await fetch('http://localhost:3000/delete-mod', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: modToDelete }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al eliminar.');

      setMessage(`Archivo ${modToDelete} eliminado con éxito.`);
      setModsList((prevMods) => prevMods.filter((mod) => mod !== modToDelete));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsModalOpen(false);
      setModToDelete('');
    }
  }, [modToDelete]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModToDelete('');
  };

  // Filtrar mods según el término de búsqueda
  const filteredMods = modsList.filter(mod =>
    mod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-4">
        <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>
        <ul className="space-y-4">
          <li><Link to="/" className="text-lg hover:text-blue-400">Consola 📟</Link></li>
          <li><Link to="/upload_mods" className="text-lg hover:text-blue-400">Gestor de Mods 🛠</Link></li>
          <li><Link to="/server_properties" className="text-lg hover:text-blue-400">Propiedades Servidor ⚙️</Link></li>
          <li><Link to="/file_manager" className="text-lg hover:text-blue-400">Gestor de Archivos 📂</Link></li>
        </ul>
      </aside>

      <div className="flex-1 p-6 flex flex-col justify-center items-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Subir archivo .jar</h2>
          <input type="file" onChange={handleFileChange} className="w-full p-3 bg-gray-700 text-white rounded-md mb-4" />
          <button onClick={handleUpload} disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md mb-4 disabled:bg-gray-600">
            {isLoading ? 'Cargando...' : 'Subir Archivo'}
          </button>
          <p className="text-center text-lg text-green-500">{message}</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md mt-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Mods Instalados</h2>
          <p className="text-center text-lg mb-4">Total de mods: {modsList.length}</p> {/* Aquí se muestra el total de mods */}
          <input
            type="text"
            placeholder="Buscar mod..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-md mb-4"
          />
          {/* Contenedor con scroll */}
          <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-lg p-2">
            <ul className="space-y-4">
              {filteredMods.length > 0 ? (
                filteredMods.map((mod) => (
                  <li key={mod} className="flex justify-between items-center bg-gray-900 border-b border-gray-700 p-2">
                    <span>{mod}</span>
                    <button onClick={() => handleDeleteConfirmation(mod)} className="text-red-600 hover:text-red-800 font-bold">
                      Eliminar
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No hay mods que coincidan con la búsqueda.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-80 text-center">
            <h3 className="text-xl font-semibold mb-4">¿Estás seguro de que deseas eliminar este archivo?</h3>
            <p className="mb-4 text-gray-300">{modToDelete}</p>
            <div className="flex justify-around">
              <button onClick={handleDelete} className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md">Eliminar</button>
              <button onClick={handleCloseModal} className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
