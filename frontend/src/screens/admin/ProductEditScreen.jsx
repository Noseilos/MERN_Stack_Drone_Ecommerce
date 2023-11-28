import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Toast } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useGetBrandsQuery,
  useGetCategoriesQuery
} from "../../slices/productsApiSlice";
import FormContainer from "../../components/FormContainer";
import { toast } from 'react-toastify';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  
  const { data: brands, isLoading: loadingBrands } = useGetBrandsQuery();
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation();

  const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setDescription(product.description);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      description,
      brand,
      category,
      countInStock
    };

    const result = await updateProduct(updatedProduct);

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Product Updated');
      navigate('/admin/products');
    }
  }

  const uploadFileHandler = async (e) => {
      const formData = new FormData();
  
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('image', e.target.files[i]);
      }
  
      try {
        const res = await uploadProductImage(formData).unwrap();
        toast.success(res.message);
        setImage(res.image); 
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        console.log(err?.data?.message || err.error);
      }
    };

  return <>
    <Link to={`/admin/products`} className="btn btn-light my-3">
      Go Back
    </Link>

    <FormContainer>
      <h1>Edit Product</h1>
      { loadingUpdate && <Loader /> }

      { isLoading ? <Loader /> : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (

        <Form onSubmit={ submitHandler }>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
                    
          <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                  as="select"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Select Brand...</option>
                  {loadingBrands ? (
                      <option>Loading brands...</option>
                  ) : (
                      brands.map((brandItem) => (
                          <option key={brandItem._id} value={brandItem.name}>
                          {brandItem.name}
                          </option>
                      ))
                  )}
                </Form.Control>
          </Form.Group>
          
          <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category...</option>
                  {loadingCategories ? (
                      <option>Loading categories...</option>
                  ) : (
                      categories.map((categoryItem) => (
                          <option key={categoryItem._id} value={categoryItem.name}>
                          {categoryItem.name}
                          </option>
                      ))
                  )}
                </Form.Control>
          </Form.Group>
          
          <Form.Group controlId="price" className="my-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
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
          
          <Form.Group controlId="countInStock" className="my-3">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>
          
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
        </Form>
      )}
    </FormContainer>
  </>;
};

export default ProductEditScreen;
