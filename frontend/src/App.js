import React from 'react'

// --- COMPONENT IMPORTS ---
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'

// --- STYLE IMPORTS ---
import { Container } from 'react-bootstrap'

// --- PACKAGE IMPORTS ---
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App