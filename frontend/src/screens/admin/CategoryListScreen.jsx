import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetCategoriesQuery, useCreateCategoriesMutation, useDeleteCategoryMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';

const CategoryListScreen = () => {
  
    const { pageNumber } = useParams();

    const { data, isLoading, error, refetch } = useGetCategoriesQuery({ pageNumber });

    const [deleteCategory, { isLoading: loadingDelete }] = useDeleteCategoryMutation();
    
    const deleteHandler = async (id) => {
        if (window.confirm('Delete item?')) {
            try {
                await deleteCategory(id);
                toast.success('Category Deleted');
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
                <h1>Categories</h1>
            </Col>
            <Col className='text-end'>
                <LinkContainer to={`/admin/category/create`}>
                    <Button className='btn-sm m-3'>
                        <FaEdit /> Create category
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
                        { data.map((cat) => (
                            <tr key={cat._id}>
                                <td>{cat._id}</td>
                                <td>{cat.name}</td>
                                <td>
                                    <LinkContainer to={`/admin/category/edit/${cat._id}`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>

                                    <Button variant='danger' className='btn-sm' style={{ color: 'white' }} onClick={ () => deleteHandler(cat._id) }>
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

export default CategoryListScreen