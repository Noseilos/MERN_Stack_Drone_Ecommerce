import { useState, useEffect } from "react"
import { Table, Form, Button, Row, Col } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { toast } from "react-toastify"
import { useProfileMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { useGetMyOrdersQuery } from "../slices/ordersSlice"
import { FaTimes } from 'react-icons/fa'
import { Carousel, Image as BootstrapImage } from "react-bootstrap";

const ProfileScreen = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    console.log(userInfo)
    const [updateProfile, {isLoading: loadingProfileUpdate}] = useProfileMutation();

    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo, userInfo.name, userInfo.email]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
        } else {
            try {
                const res = await updateProfile({ 
                    _id: userInfo._id,
                    name,
                    email,
                    password
                }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully')
            } catch (err) {
                toast.error(err?.data?.message || err.error)                
            }
        }
    }

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>

            {userInfo.image && userInfo.image.length > 1 ? (
                <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
                  {userInfo.image.map((image, index) => (
                    <Carousel.Item key={index}>
                      <BootstrapImage src={image} alt={`Image ${index + 1}`} fluid />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <BootstrapImage src={userInfo.image} alt={userInfo.name} fluid />
              )}

            <Form onSubmit={submitHandler}>
                <Form.Group
                    controlId='name'
                    className='my-2'
                >
                    <Form.Label>Name: </Form.Label>
                    <Form.Control
                        type="name"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                
                <Form.Group
                    controlId='email'
                    className='my-2'
                >
                    <Form.Label>Email: </Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                
                <Form.Group
                    controlId='password'
                    className='my-2'
                >
                    <Form.Label>Password: </Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                
                <Form.Group
                    controlId='confirmPassword'
                    className='my-2'
                >
                    <Form.Label>Confirm Password: </Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="my-2">
                    Update
                </Button>

                { loadingProfileUpdate && <Loader /> }
            </Form>
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>
            
            { isLoading ?
                <Loader />
            : error ? (
                <Message variant='danger'>
                    { error?.data?.message || error.error }
                </Message>
            ) : (
                <Table striped hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>₱{ parseFloat(order.totalPrice).toLocaleString() }</td>
                                <td>
                                    { order.isPaid ? (
                                        order.paidAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    { order.isDelivered ? (
                                        order.deliveredAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button className="btn-sm" variant="light">
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>   
                        )) }
                    </tbody>
                </Table>
            ) }
        </Col>
    </Row>
  )
}

export default ProfileScreen