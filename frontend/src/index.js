import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- STYLE IMPORTS ---
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';

// --- PACKAGE IMPORTS ---
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

// --- SCREEN IMPORTS
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={ true } path='/' element={ <HomeScreen /> }/>
      <Route path='/product/:id' element={ <ProductScreen /> }/>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={ router }/>
  </React.StrictMode>
);

reportWebVitals();
