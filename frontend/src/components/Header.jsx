import React from 'react'

// --- PACKAGE IMPORTS --- 
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// --- FILE IMPORTS ---
import logo from '../assets/new.png'

// --- SLICE IMPORT --- 
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout } from '../slices/authSlice'

// --- COMPONENT IMPORT --- 
import SearchBox from './SearchBox'



const Header = () => {

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ logoutApiCall ] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.log(err)
        }
    }

    console.log(cartItems)

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
                        <SearchBox />
                        <LinkContainer to='/cart'>
                            <Nav.Link><FaShoppingCart />Cart
                                {
                                    cartItems.length > 0 && (
                                        <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                                            { cartItems.reduce((a, c) => a + c.qty, 0) }
                                        </Badge>
                                    )
                                }
                            </Nav.Link>
                        </LinkContainer>

                        { userInfo ? (
                        <>
                            <figure className="avatar avatar-nav">
                                <img
                                    src={userInfo.image[0]}
                                    alt={userInfo && userInfo.name}
                                    className="rounded-circle"
                                />
                            </figure>
                            <NavDropdown title={ userInfo.name } id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>
                                        Profile
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </>
                        ) : (
                            <LinkContainer to='/login'>
                                <Nav.Link><FaUser />Log In</Nav.Link>
                            </LinkContainer>
                        ) }
                        { userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='adminMenu'>
                                <LinkContainer to='/admin/users'>
                                    <NavDropdown.Item>
                                        Users
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/products'>
                                    <NavDropdown.Item>
                                        Products
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/categories'>
                                    <NavDropdown.Item>
                                        Categories
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/brands'>
                                    <NavDropdown.Item>
                                        Brands
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/orders'>
                                    <NavDropdown.Item>
                                        Orders
                                    </NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        ) }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header