import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery } from '../slices/ordersSlice'

const OrderScreen = () => {

    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, isError } = useGetOrderDetailsQuery(orderId);

    console.log(order)

  return isLoading ? <Loader /> : isError ? (
    <Message variant='danger'>

    </Message>
  ) : (
    <>
        <h2>Order: {order._id}</h2>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Name: </strong>{order.user.name}
                        </p>
                        <p>
                            <strong>Email: </strong>{order.user.email}
                        </p>
                        <p>
                            <strong>Name: </strong>{order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country} 
                        </p>
                        { order.isDelivered ? (
                            <Message variant='success'>
                                Delivered at { order.deliveredAt }
                            </Message>
                        ) : (
                            <Message variant='danger'>
                                Not Delivered
                            </Message>
                        ) }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p><strong>Method: </strong>
                            { order.paymentMethod }
                        </p>
                        { order.isPaid ? (
                            <Message variant='success'>
                                Paid at { order.paidAt }
                            </Message>
                        ) : (
                            <Message variant='danger'>
                                Not Paid
                            </Message>
                        ) }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                            { order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col >
                                            <Link to={`product/${item._id}`}>{item.name}</Link>
                                        </Col>
                                        <Col >
                                            { item.qty } x ₱{parseFloat(item.price).toLocaleString()} = ₱{(item.qty * item.price).toLocaleString()}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )) }
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>₱{parseFloat(order.itemsPrice).toLocaleString()}</Col>
                            </Row>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>₱{parseFloat(order.shippingPrice).toLocaleString()}</Col>
                            </Row>
                            <Row>
                                <Col>Tax</Col>
                                <Col>₱{parseFloat(order.taxPrice).toLocaleString()}</Col>
                            </Row>
                            <Row>
                                <Col>Total</Col>
                                <Col>₱{parseFloat(order.totalPrice).toLocaleString()}</Col>
                            </Row>
                        </ListGroup.Item>
                        {/* PAY ORDER PLACEHOLDER */}
                        {/* MARK AS DELIVERED PLACEHOLDER */}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default OrderScreen