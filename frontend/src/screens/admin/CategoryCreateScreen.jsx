import { useState, useEffect } from "react";
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useCreateCategoriesMutation, useUploadCategoryImageMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { Form,Button, FormGroup, FormControl } from 'react-bootstrap';
import FormContainer from "../../components/FormContainer";

const CategoryCreateScreen = () => {
  
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    
    const navigate = useNavigate();

    const [uploadCategoryImage, { isLoading: loadingUpload }] = useUploadCategoryImageMutation();
    const [createCategory, { isLoading: loadingCreate, error }] = useCreateCategoriesMutation();

    useEffect(() => { 
            setName(name);
            setImage(image);
    },);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        try {
            const res = await uploadCategoryImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
      
        const newCategory = {
          name,
          image,
        };
      
        const result = await createCategory(newCategory);
      
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Category Created');
          navigate('/');
        }
      };

  return (
    <>
        <FormContainer>
            <h1>Create Category</h1>
            { loadingCreate && <Loader /> }

            { loadingCreate ? <Loader /> : error ? <Message variant='danger'>{ error }</Message> : (
                <Form onSubmit={ submitHandler }>
                    <FormGroup controlId="name" className="my-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </FormGroup>

                    <FormGroup controlId="image" className="my-2">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="hidden"
                            value={ image }
                            onChange={ (e) => setImage(e.target.value) }>
                        </Form.Control>
                        <Form.Control
                            type="file"
                            label="Choose file"
                            onChange={ uploadFileHandler }>
                        </Form.Control>
                    </FormGroup>
                    { loadingUpload && <Loader /> }
                    
                    <Button
                        type="submit"
                        variant="primary"
                        className="my-2">
                        Create
                    </Button>
                </Form>
            ) }
        </FormContainer>
    </>
  )
}

export default CategoryCreateScreen