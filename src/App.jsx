import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom'; // Usa Routes en vez de Switch
import io from 'socket.io-client';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlay, FaStop, FaTerminal, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Uploadmods from './Upload';


//const socket = io('http://annie-mammoth.with.playit.plus');
const API_URL = "http://annie-mammoth.with.playit.plus"; 
const socket = io('http://localhost:3000');

function App() {
  const [logs, setLogs] = useState([]);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const logsEndRef = useRef(null);

  useEffect(() => {
    socket.on('log', (log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    return () => {
      socket.off('log');
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleServerAction = async (action) => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:3000/${action}`);
      console.log(res.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendCommand = async () => {
    if (!command.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/command`, { command });
      console.log(res.data);
      setCommand('');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
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
      <div className="flex-1 p-6 flex flex-col justify-center items-center">

        <motion.h1 
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔥 Panel de Control Minecraft 🔥
        </motion.h1>

        {/* Botones de acción */}
        <div className="flex gap-4 mb-6">
          <motion.button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded shadow-lg transition-all"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleServerAction('start')}
            disabled={loading}
          >
            {loading ? 'Cargando...' : <><FaPlay /> Arrancar</>}
          </motion.button>
        {/*
          <motion.button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded shadow-lg transition-all"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleServerAction('restart')}
            disabled={loading}
          >
            {loading ? 'Cargando...' : <><FaSync /> Reiniciar</>}
          </motion.button>
        */}
        
          <motion.button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2 rounded shadow-lg transition-all"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleServerAction('stop')}
            disabled={loading}
          >
            {loading ? 'Cargando...' : <><FaStop /> Detener</>}
          </motion.button>
        </div>

        {/* Input y botón de comando */}
        <div className="flex gap-4 mb-6 w-full max-w-lg">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Escribe un comando..."
            className="flex-1 border border-gray-700 bg-gray-800 p-2 rounded outline-none text-white"
          />
          <motion.button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded shadow-lg transition-all"
            whileTap={{ scale: 0.9 }}
            onClick={sendCommand}
          >
            <FaTerminal /> Enviar
          </motion.button>
        </div>

        {/* Contenedor de logs */}
        <div className="bg-gray-800 p-4 rounded shadow-lg h-64 w-full max-w-2xl overflow-y-scroll border border-gray-700">
          <h2 className="text-xl mb-2">📜 Logs del Servidor:</h2>
          <div className="text-sm text-gray-300">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                className="p-1 border-b border-gray-700"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {log}
              </motion.div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
