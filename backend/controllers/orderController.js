import asyncHandler from '../middleware/asyncHandler.js'
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import sendEmailWithReceipt from '../utils/sendEmail.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => { 
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if(orderItems && orderItems === 0) {
        res.status(400);
        throw new Error('No ordered items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// @desc    Get logged in user order
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => { 
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => { 
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if( order ){
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => { 
    const order = await Order.findById(req.params.id);
    const message = `Order Processing!`
    const user = await User.findById(req.user._id);

    try {

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
    
            const updatedOrder = await order.save();
    
            res.status(200).json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }

        await sendEmailWithReceipt({
            email: user.email,
            subject: 'NTech Order Confirmation',
            message
        }, order)

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        res.status(404);
        throw new Error('Order not found');
    }

});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => { 
    const order = await Order.findById(req.params.id);
    const message = `Order Delivered!`
    const user = await User.findById(req.user._id);

    try {
        
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now()

            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }

        await sendEmail({
            email: user.email,
            subject: 'NTech Order Status',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => { 
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
};