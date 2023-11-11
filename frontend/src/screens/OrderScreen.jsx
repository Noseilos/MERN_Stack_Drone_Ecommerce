import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
} from "../slices/ordersSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    isError,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
        const loadPayPalScript = async () => {
            paypalDispatch({
                type: 'resetOptions',
                value: {
                    'clientId': paypal.clientId,
                    currency: 'PHP',
                }
            });
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
        }

        if (order && !order.isPaid) {
            if (!window.paypal) {
                loadPayPalScript();
            }
        }
    }
  }, [ order, paypal, paypalDispatch, loadingPayPal, errorPayPal ]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function(details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Payment Sucessful')
      } catch (err) {
        toast.error(err?.data?.message || err.message)
      }
    });
  }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success('Payment Sucessful')
  }

  function onError(err) {
    toast.error(err?.data?.message || err.message)
  }

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
          }
        }
      ]
    }).then((orderId) => {
      return orderId;
    })
  }

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger"></Message>
  ) : (
    <>
      <h2>Order: {order._id}</h2>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Name: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered at {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid at {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col>
                      {item.qty} x ₱{parseFloat(item.price).toLocaleString()} =
                      ₱{(item.qty * item.price).toLocaleString()}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
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
              
              <ListGroup.Item>

                { !order.isPaid && (
                  <ListGroup.Item>
                    { loadingPay && <Loader /> }

                    { isPending ? ( 
                      <Loader /> 
                    ) : (
                      <div>
                        {/* <Button onClick={ onApproveTest } style={{ marginBottom: '10px' }}>Test Pay Order</Button> */}
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}></PayPalButtons>
                        </div>
                      </div>
                    ) }
                  </ListGroup.Item>
                ) }

              </ListGroup.Item>
              {/* MARK AS DELIVERED PLACEHOLDER */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
