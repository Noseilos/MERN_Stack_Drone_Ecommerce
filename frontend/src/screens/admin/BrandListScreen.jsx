import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetBrandsQuery, useDeleteBrandMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';

const BrandListScreen = () => {
  
    const { pageNumber } = useParams();

    const { data, isLoading, error, refetch } = useGetBrandsQuery({ pageNumber });

    const [deleteBrand, { isLoading: loadingDelete }] = useDeleteBrandMutation();
    
    const deleteHandler = async (id) => {
        if (window.confirm('Delete item?')) {
            try {
                await deleteBrand(id);
                toast.success('Brand Deleted');
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
                <h1>Brands</h1>
            </Col>
            <Col className='text-end'>
                <LinkContainer to={`/admin/brand/create`}>
                    <Button className='btn-sm m-3'>
                        <FaEdit /> Create brand
                    </Button>
                </LinkContainer>
            </Col>
        </Row>
        { loadingDelete && <Loader /> }

        { isLoading ? <Loader /> : error ? <Message variant='danger'>{ error }</Message> : (
            <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { data.map((brand) => (
                            <tr key={brand._id}>
                                <td>{brand._id}</td>
                                <td>{brand.name}</td>
                                <td>
                                    <LinkContainer to={`/admin/brand/edit/${brand._id}`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>

                                    <Button variant='danger' className='btn-sm' style={{ color: 'white' }} onClick={ () => deleteHandler(brand._id) }>
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

export default BrandListScreen