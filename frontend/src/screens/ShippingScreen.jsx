import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal Code is required'),
    country: Yup.string().required('Country is required'),
});

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            address: shippingAddress?.address || '',
            city: shippingAddress?.city || '',
            postalCode: shippingAddress?.postalCode || '',
            country: shippingAddress?.country || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            dispatch(saveShippingAddress(values));
            navigate('/payment');
        },
    });

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />

            <h1>Shipping</h1>

            <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="address" className="my-2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Address"
                        name="address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                    />
                    {formik.touched.address && formik.errors.address && (
                        <div className="text-danger">{formik.errors.address}</div>
                    )}
                </Form.Group>

                <Form.Group controlId="city" className="my-2">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter City"
                        name="city"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.city}
                    />
                    {formik.touched.city && formik.errors.city && (
                        <div className="text-danger">{formik.errors.city}</div>
                    )}
                </Form.Group>

                <Form.Group controlId="postalCode" className="my-2">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Postal Code"
                        name="postalCode"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.postalCode}
                    />
                    {formik.touched.postalCode && formik.errors.postalCode && (
                        <div className="text-danger">{formik.errors.postalCode}</div>
                    )}
                </Form.Group>

                <Form.Group controlId="country" className="my-2">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Country"
                        name="country"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.country}
                    />
                    {formik.touched.country && formik.errors.country && (
                        <div className="text-danger">{formik.errors.country}</div>
                    )}
                </Form.Group>

                <Button type="submit" variant="primary" className="my-3">
                    Continue
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;
