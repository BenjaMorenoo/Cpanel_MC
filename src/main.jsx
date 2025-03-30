import React from 'react';
import ReactDOM from 'react-dom/client'; // Asegúrate de importar desde 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Upload from './Upload'; // Asegúrate de importar Upload correctamente
import ServerProperties from './ServerProperties';
import FileManager from './FileManager';

// Cambia ReactDOM.render() por createRoot()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/upload_mods" element={<Upload />} />
      <Route path='/server_properties' element={<ServerProperties />} />
      <Route path='/file_manager' element={<FileManager />} />
    </Routes>
  </Router>
);




import './index.css'