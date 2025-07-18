import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import {App} from "./App";

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
reportWebVitals();


