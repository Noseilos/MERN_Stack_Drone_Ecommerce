import React from 'react'
import { useState, useEffect } from "react";
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useUpdateBrandMutation, useUploadBrandImageMutation, useGetBrandDetailsQuery } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { Form ,Button, FormGroup, FormControl } from 'react-bootstrap';
import FormContainer from "../../components/FormContainer";
import { Carousel, Image as BootstrapImage } from "react-bootstrap";

const BrandEditScreen = () => {
    const { id: brandId } = useParams();
  
    const [name, setName] = useState('');
    const [image, setImage] = useState([]);
    
    const navigate = useNavigate();

    const {
        data: brand,
        isLoading,
        error,
        refetch,
      } = useGetBrandDetailsQuery(brandId);

    const [uploadBrandImage, { isLoading: loadingUpload }] = useUploadBrandImageMutation();
    const [updateBrand, { isLoading: loadingUpdate}] = useUpdateBrandMutation();

    useEffect(() => {
      if (brand) {
        setName(brand.name);
        setImage(brand.image);
      }
    }, [brand]);

    console.log(brand)
  
    const submitHandler = async (e) => {
      e.preventDefault();
      const updatedBrand = {
        brandId,
        name,
        image,
      };
  
      const result = await updateBrand(updatedBrand);
  
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Brand Updated');
        navigate('/admin/brands');
      }
    }
  
    const uploadFileHandler = async (e) => {
        const formData = new FormData();
    
        for (let i = 0; i < e.target.files.length; i++) {
          formData.append('image', e.target.files[i]);
        }
    
        try {
          const res = await uploadBrandImage(formData).unwrap();
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
    <Link to={`/admin/brands`} className="btn btn-light my-3">
      Go Back
    </Link>

    <FormContainer>
      <h1>Edit Brand</h1>
      { loadingUpdate && <Loader /> }

      { isLoading ? <Loader /> : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (

        <Form onSubmit={ submitHandler }>
          
          <Form.Group controlId="name" className="my-2">
              <Form.Label>Brand</Form.Label>
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

            {brand.image && brand.image.length > 1 ? (
                <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
                {brand.image.map((image, index) => (
                    <Carousel.Item key={index}>
                    <BootstrapImage src={image} alt={`Image ${index + 1}`} fluid />
                    </Carousel.Item>
                ))}
                </Carousel>
            ) : (
                <BootstrapImage src={brand.image} alt={brand.name} fluid />
            )}

          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
        </Form>
      )}
    </FormContainer>
  </>;
}

export default BrandEditScreen