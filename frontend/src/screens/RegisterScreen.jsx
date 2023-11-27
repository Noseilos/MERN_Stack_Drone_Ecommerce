import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useRegisterMutation, useUploadUserImageMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    image: Yup.array().min(1, 'Please upload at least one image'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const RegisterScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();
    const [uploadUserImage, { isLoading: loadingUpload }] = useUploadUserImageMutation();

    const { userInfo } = useSelector((state) => state.auth);
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            image: [],
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (values.password !== values.confirmPassword) {
                toast.error('Passwords do not match!');
                return;
            } else {
                try {
                    const res = await register({ ...values }).unwrap();
                    dispatch(setCredentials({ ...res }));
                    navigate(redirect);
                } catch (err) {
                    toast.error(err?.data?.message || err.error);
                }
            }
        },
    });

    const uploadFileHandler = async (e) => {
        const formData = new FormData();

        for (let i = 0; i < e.target.files.length; i++) {
            formData.append('image', e.target.files[i]);
        }

        try {
            const res = await uploadUserImage(formData).unwrap();
            toast.success(res.message);
            formik.setFieldValue('image', res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
            console.log(err?.data?.message || err.error);
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate]);

    return (
        <FormContainer>
            <h1>Register</h1>

            <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId='name' className='my-3'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Name'
                        name='name'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    <div className='text-danger'>{formik.touched.name && formik.errors.name}</div>
                </Form.Group>

                <Form.Group controlId='email' className='my-3'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        name='email'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    <div className='text-danger'>{formik.touched.email && formik.errors.email}</div>
                </Form.Group>

                <Form.Group controlId='image' className='my-2'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type='file'
                        label='Choose files'
                        multiple
                        onChange={uploadFileHandler}
                    />
                    <div className='text-danger'>{formik.touched.image && formik.errors.image}</div>
                </Form.Group>

                <Form.Group controlId='password' className='my-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        name='password'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <div className='text-danger'>{formik.touched.password && formik.errors.password}</div>
                </Form.Group>

                <Form.Group controlId='confirmPassword' className='my-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm Password'
                        name='confirmPassword'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                    />
                    <div className='text-danger'>{formik.touched.confirmPassword && formik.errors.confirmPassword}</div>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-3' disabled={isLoading}>
                    Register
                </Button>

                {isLoading && <Loader />}

            </Form>

            <Row className='py-3'>
                <Col>
                    Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default RegisterScreen;
