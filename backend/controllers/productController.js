import asyncHandler from '../middleware/asyncHandler.js'
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import Brand from '../models/brandModel.js';

// @desc    Fetch ALL products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {

    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        return res.json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Create a product
// @route   POST /api/products/
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description
    } = req.body

    const product = new Product({
        name,
        price,
        user: req.user._id,
        image,
        brand,
        category,
        countInStock,
        numReviews: 0,
        description,
    });

    const createProduct = await product.save();
    res.status(201).json(createProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name,
            product.price = price,
            product.description = description,
            product.image = image,
            product.brand = brand,
            product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id })
        res.status(200).json({ message: 'Product deleted' });
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Create a review
// @route   POST /api/products/:id/reviews
// @access  Private/Admin
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.status(200).json(products);
});

// ----------------- CATEGORY FUNCTIONS -----------------

// @desc    Create a category
// @route   POST /api/categories/
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const {
        name,
        image,
    } = req.body

    const category = new Category({
        user: req.user._id,
        name,
        image,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
    res.send(createdCategory);
});

// @desc    Fetch ALL categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.status(200).json(categories);
});

// ----------------- BRAND FUNCTIONS -----------------

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
    const {
        name,
        image,
    } = req.body

    const brand = new Brand({
        user: req.user._id,
        name,
        image,
    });

    const createdBrand = await brand.save();
    res.status(201).json(createdBrand);
    res.send(createdBrand);
});

// @desc    Fetch ALL categories
// @route   GET /api/categories
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find({});
    res.status(200).json(brands);
});


export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts, createCategory, getCategories, createBrand, getBrands };