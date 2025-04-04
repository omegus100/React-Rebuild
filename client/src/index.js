import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css' // Core FilePond styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css' // Image preview styles
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

// Register the plugins globally
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

