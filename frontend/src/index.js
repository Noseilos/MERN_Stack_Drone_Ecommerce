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
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import store from './store';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- SCREEN IMPORTS
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderlistScreen from './screens/admin/OrderlistScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';

// --- COMPONENT IMPORTS
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={ true } path='/' element={ <HomeScreen /> }/>
      <Route path='/page/:pageNumber' element={ <HomeScreen /> }/>
      <Route path='/product/:id' element={ <ProductScreen /> }/>
      <Route path='/cart' element={ <CartScreen /> }/>
      <Route path='/login' element={ <LoginScreen /> }/>
      <Route path='/register' element={ <RegisterScreen /> }/>

      <Route path='' element={ <PrivateRoute /> }>
        <Route path='/shipping' element={ <ShippingScreen /> }/>
        <Route path='/payment' element={ <PaymentScreen /> }/>
        <Route path='/placeorder' element={ <PlaceOrderScreen /> }></Route>
        <Route path='/order/:id' element={ <OrderScreen /> }></Route>
        <Route path='/profile' element={ <ProfileScreen /> }></Route>
      </Route>

      <Route path='' element={ <AdminRoute /> }>
        <Route path='/admin/orders' element={ <OrderlistScreen /> }/>
        <Route path='/admin/products' element={ <ProductListScreen /> }/>
        <Route path='/admin/product/edit/:id' element={ <ProductEditScreen /> }/>
        <Route path='/admin/users' element={ <UserListScreen /> }/>
        <Route path='/admin/user/edit/:id' element={ <UserEditScreen /> }/>
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={ router }/>
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
