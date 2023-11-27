import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap"
import { toast } from 'react-toastify'
import CheckoutSteps from "../components/CheckoutSteps"
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useCreateOrderMutation } from '../slices/ordersSlice'
import { clearCartItems } from '../slices/cartSlice'

const PlaceOrderScreen = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [createOrder, {isLoading, error: errorCreate}] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }).unwrap();

            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <>
        <CheckoutSteps step1 step2 step3 step4/>   
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            { cart.shippingAddress.address }, { cart.shippingAddress.city }{' '} { cart.shippingAddress.postalCode }{' '}, { cart.shippingAddress.country } 
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <strong>Method: </strong>
                        { cart.paymentMethod }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        { cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <ListGroup variant="flush">
                                { cart.cartItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image[0]} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item._id}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={4}>
                                                { item.qty } x ₱{ parseFloat(item.price).toLocaleString() } = ₱{ (item.qty * item.price).toLocaleString() }
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )) }
                            </ListGroup>
                        ) }
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items: </Col>
                                <Col>₱{parseFloat(cart.itemsPrice).toLocaleString()}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping: </Col>
                                <Col>₱{parseFloat(cart.shippingPrice).toLocaleString()}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax: </Col>
                                <Col>₱{parseFloat(cart.taxPrice).toLocaleString()}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total: </Col>
                                <Col>₱{parseFloat(cart.totalPrice).toLocaleString()}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                        {errorCreate && (
                            <Message variant='danger'>
                                {typeof errorCreate.data === 'object'
                                ? JSON.stringify(errorCreate.data)
                                : errorCreate.data || 'An error occurred'}
                            </Message>
                        )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cart.cartItems.length === 0}
                                onClick={ placeOrderHandler }
                            >Order</Button>

                            { isLoading && <Loader /> }
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  );
};

export default PlaceOrderScreen;