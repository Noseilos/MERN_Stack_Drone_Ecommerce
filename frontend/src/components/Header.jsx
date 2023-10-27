import React from 'react'

// --- STYLE IMPORTS --- 
import { Navbar, Nav, Container } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import logo from '../assets/new.png'

const Header = () => {
  return (
    <header>
        <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
            <Container>
                <Navbar.Brand href='/'>
                    <img src={logo} alt="NTech" style={{ marginRight: '10px' }}/>
                    NTech
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse>
                    <Nav className="ms-auto">
                        <Nav.Link href='/cart'><FaShoppingCart />Cart</Nav.Link>
                        <Nav.Link href='/login'><FaUser />Log In</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header