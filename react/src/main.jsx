import React from 'react';

import ReactDOMClient from 'react-dom/client';
import './index.css';

const app = <h1>hola compadres</h1>;
const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container);

root.render(<React.StrictMode>{app}</React.StrictMode>);
