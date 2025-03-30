import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function FileManager() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:3000/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        throw new Error("No se pudo obtener la lista de archivos");
      }
    } catch (error) {
      console.error("Error al obtener archivos:", error);
      setErrorMessage("No se pudo obtener la lista de archivos");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Selecciona un archivo');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchFiles();
        setSelectedFile(null);
        alert('Archivo subido correctamente');
      } else {
        throw new Error("Hubo un problema al subir el archivo");
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
      setErrorMessage("Error al conectar con el servidor");
    }
    setLoading(false);
  };

  const handleDelete = async (filename) => {
    if (window.confirm(`¿Seguro que quieres eliminar el archivo ${filename}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/delete/${filename}`, { method: 'DELETE' });
        if (response.ok) {
          fetchFiles();
          alert(`Archivo ${filename} eliminado`);
        } else {
          throw new Error("Hubo un problema al eliminar el archivo");
        }
      } catch (error) {
        console.error("Error al eliminar archivo:", error);
        setErrorMessage("Error al conectar con el servidor");
      }
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
          📂 Administrar Archivos 📂
        </motion.h1>

        {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}

        {/* Lista de archivos */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-5xl h-[500px] overflow-y-auto">
          <ul className="mb-4">
            {files.length > 0 ? (
              files.map((file) => (
                <li key={file} className="flex justify-between items-center mb-2 bg-gray-700 p-2 rounded">
                  {file}
                  <button 
                    onClick={() => handleDelete(file)} 
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    ❌
                  </button>
                </li>
              ))
            ) : (
              <li>No hay archivos disponibles.</li>
            )}
          </ul>
        </div>

        {/* Subir archivo */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-5xl mb-6">
          <input 
            type="file" 
            onChange={(e) => setSelectedFile(e.target.files[0])} 
            className="mb-2" 
          />
          <button 
            onClick={handleUpload} 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Subiendo..." : "📤 Subir Archivo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileManager;
