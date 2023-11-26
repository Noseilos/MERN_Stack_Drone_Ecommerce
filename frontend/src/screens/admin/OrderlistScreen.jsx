import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { useGetOrdersQuery } from '../../slices/ordersSlice'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from "chart.js/auto";

const OrderlistScreen = () => {

  const { data: orders, isLoading, error } = useGetOrdersQuery();
  console.log(orders)

  const dates = orders ? orders.map(order => order.createdAt.substring(0, 10)) : [];
  const totalPrices = orders ? orders.map(order => order.totalPrice) : [];

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Total Price',
        data: totalPrices,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const products = orders ? orders.flatMap(order => order.orderItems.map(item => item.name)) : [];
  const productCounts = products.reduce((acc, product) => {
    acc[product] = (acc[product] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(productCounts),
    datasets: [
      {
        label: 'Sales',
        data: Object.values(productCounts),
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

  return (
    <>
      <h1>Orders</h1>
      { isLoading ? <Loader /> : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                <td>{ order.user && order.user.name }</td>
                <td>{ order.createdAt.substring(0, 10) }</td>
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
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            )) }
          </tbody>
        </Table>
        <Line data={data} />
        <Bar data={barData} />
        </>
      ) }
    </>
  )
}

export default OrderlistScreen