import { PRODUCTS_URL, UPLOAD_URL, CATEGORIES_URL, BRANDS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword, pageNumber }) => ({
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber,
                }
            }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: UPLOAD_URL,
                method: 'POST',
                body: data,
            })
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            })
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product']
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`
            }),
            keepUnusedDataFor: 5,
        }),

        // -------------------- CATEGORY SLICES --------------------

        createCategories: builder.mutation({
            query: (data) => ({
                url: CATEGORIES_URL,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Category']
        }),
        uploadCategoryImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}/category`,
                method: 'POST',
                body: data,
            })
        }),
        getCategories: builder.query({
            query: () => ({
                url: CATEGORIES_URL,
            }),
            providesTags: ['Category'],
            keepUnusedDataFor: 5,
        }),

        // -------------------- BRAND SLICES --------------------

        createBrand: builder.mutation({
            query: (data) => ({
                url: BRANDS_URL,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Brand']
        }),
        uploadBrandImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}/brand`,
                method: 'POST',
                body: data,
            })
        }),
        getBrands: builder.query({
            query: () => ({
                url: BRANDS_URL,
            }),
            providesTags: ['Brand'],
            keepUnusedDataFor: 5,
        }),
    }),
});

export const { 
    useGetProductsQuery,
    useGetProductDetailsQuery, 
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useCreateCategoriesMutation,
    useUploadCategoryImageMutation,
    useGetCategoriesQuery,
    useCreateBrandMutation,
    useUploadBrandImageMutation,
    useGetBrandsQuery,
} = productsApiSlice;