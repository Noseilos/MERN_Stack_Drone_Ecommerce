import React from 'react'
import { useState, useEffect } from "react";
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useUpdateCategoryMutation, useUploadCategoryImageMutation, useGetCategoryDetailsQuery } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { Form ,Button, FormGroup, FormControl } from 'react-bootstrap';
import FormContainer from "../../components/FormContainer";
import { Carousel, Image as BootstrapImage } from "react-bootstrap";

const CategoryEditScreen = () => {
    const { id: categoryId } = useParams();
  
    const [name, setName] = useState('');
    const [image, setImage] = useState([]);
    
    const navigate = useNavigate();

    const {
        data: category,
        isLoading,
        error,
        refetch,
      } = useGetCategoryDetailsQuery(categoryId);

    const [uploadCategoryImage, { isLoading: loadingUpload }] = useUploadCategoryImageMutation();
    const [updateCategory, { isLoading: loadingUpdate}] = useUpdateCategoryMutation();

    useEffect(() => {
      if (category) {
        setName(category.name);
        setImage(category.image);
      }
    }, [category]);

    console.log(category)
  
    const submitHandler = async (e) => {
      e.preventDefault();
      const updatedCategory = {
        categoryId,
        name,
        image,
      };
  
      const result = await updateCategory(updatedCategory);
  
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Category Updated');
        navigate('/admin/categories');
      }
    }
  
    const uploadFileHandler = async (e) => {
        const formData = new FormData();
    
        for (let i = 0; i < e.target.files.length; i++) {
          formData.append('image', e.target.files[i]);
        }
    
        try {
          const res = await uploadCategoryImage(formData).unwrap();
          toast.success(res.message);
          setImage(res.image); 
        } catch (err) {
          toast.error(err?.data?.message || err.error);
          console.log(err?.data?.message || err.error);
        }
      };

      const [activeIndex, setActiveIndex] = useState(0);
    
      const handleSelect = (selectedIndex, e) => {
        setActiveIndex(selectedIndex);
      };

  return <>
    <Link to={`/admin/categories`} className="btn btn-light my-3">
      Go Back
    </Link>

    <FormContainer>
      <h1>Edit Category</h1>
      { loadingUpdate && <Loader /> }

      { isLoading ? <Loader /> : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (

        <Form onSubmit={ submitHandler }>
          
          <Form.Group controlId="name" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

          <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                  type="file"
                  label="Choose files"
                  multiple
                  onChange={uploadFileHandler}
              ></Form.Control>
          </Form.Group>
          { loadingUpload && <Loader /> }

          {category.image && category.image.length > 1 ? (
              <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
                {category.image.map((image, index) => (
                  <Carousel.Item key={index}>
                    <BootstrapImage src={image} alt={`Image ${index + 1}`} fluid />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <BootstrapImage src={category.image} alt={category.name} fluid />
            )}

          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
        </Form>
      )}
    </FormContainer>
  </>;
}

export default CategoryEditScreen