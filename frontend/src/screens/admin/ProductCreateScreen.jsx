import { useState, useEffect } from "react";
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useUploadProductImageMutation, useCreateProductMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { Form,Button, FormGroup, FormControl } from 'react-bootstrap';
import FormContainer from "../../components/FormContainer";

const ProductCreateScreen = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    

    const navigate = useNavigate();

    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
    const [createProduct, { isLoading: loadingCreate, error }] = useCreateProductMutation();

    useEffect(() => { 
            setName(name);
            setPrice(price);
            setImage(image);
            setBrand(brand);
            setCategory(category);
            setCountInStock(countInStock);
            setDescription(description);
        
    },);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
      
        const newProduct = {
          name,
          price,
          image,
          brand,
          category,
          countInStock,
          description,
        };
      
        const result = await createProduct(newProduct);
      
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Product Created');
          navigate('/admin/productlist');
        }
      };

  return (
    <>
        <FormContainer>
            <h1>Create Product</h1>
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
                    
                    <FormGroup controlId="price" className="my-2">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        ></Form.Control>
                    </FormGroup>

                    <FormGroup controlId="image" className="my-2">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter image url"
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
                    
                    <FormGroup controlId="brand" className="my-2">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        ></Form.Control>
                    </FormGroup>
                    
                    <FormGroup controlId="countInStock" className="my-2">
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Count In Stock"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </FormGroup>
                    
                    <FormGroup controlId="category" className="my-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        ></Form.Control>
                    </FormGroup>
                    
                    <FormGroup controlId="description" className="my-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                    </FormGroup>

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

export default ProductCreateScreen;