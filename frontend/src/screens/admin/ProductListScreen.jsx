import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';

const ProductListScreen = () => {

    const { pageNumber } = useParams();

    const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
    
    const deleteHandler = async (id) => {
        if (window.confirm('Delete item?')) {
            try {
                await deleteProduct(id);
                toast.success('Product Deleted');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        } else {
            
        }
    }

  return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-end'>
                <LinkContainer to={`/admin/product/create`}>
                    <Button className='btn-sm m-3'>
                        <FaEdit /> Create product
                    </Button>
                </LinkContainer>
            </Col>
        </Row>

        { loadingCreate && <Loader /> }
        { loadingDelete && <Loader /> }

        { isLoading ? <Loader /> : error ? <Message variant='danger'>{ error }</Message> : (
            <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { data.products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/edit/${product._id}`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>

                                    <Button variant='danger' className='btn-sm' style={{ color: 'white' }} onClick={ () => deleteHandler(product._id) }>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </Table>
                <Paginate pages={data.pages} page={data.page} isAdmin={true} />
            </>
        ) }
    </>
  )
}

export default ProductListScreen