import React from 'react'

// --- PACKAGE IMPORTS --- 
import { Navbar, Nav, Container } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'

// --- FILE IMPORTS ---
import logo from '../assets/new.png'



const Header = () => {
  return (
    <header>
        <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand>
                        <img src={logo} alt="NTech" style={{ marginRight: '10px' }}/>
                        NTech
                    </Navbar.Brand> 
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse>
                    <Nav className="ms-auto">
                        <LinkContainer to='/cart'>
                            <Nav.Link><FaShoppingCart />Cart</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/login'>
                            <Nav.Link><FaUser />Log In</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header