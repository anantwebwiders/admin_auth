const { sendSuccess, sendError } = require('../utils/helper');
const productService = require('../services/productService');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    return sendSuccess(res, 'Product created successfully', product);
  } catch (error) {
    return sendError(res, 'Failed to create product', error.message);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    return sendSuccess(res, 'Products fetched successfully', products);
  } catch (error) {
    return sendError(res, 'Failed to fetch products', error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return sendSuccess(res, 'Product updated successfully', product);
  } catch (error) {
    return sendError(res, 'Failed to update product', error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    return sendSuccess(res, 'Product deleted successfully', product);
  } catch (error) {
    return sendError(res, 'Failed to delete product', error.message);
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await productService.createOrder(req, req.body);
    return sendSuccess(res, 'Order placed successfully', order);
  } catch (error) {
    return sendError(res, 'Failed to create order', error.message);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await productService.getOrders(req);
    console.log(orders);
    return sendSuccess(res, 'Orders fetched successfully', orders);
  } catch (error) {
    return sendError(res, 'Failed to fetch orders', error.message);
  }
};

const allOrders = async (req, res) => {
try{
    const orders = await productService.allOrders(req);
    return sendSuccess(res, 'Orders fetched successfully', orders);
  } catch (error) {
    return sendError(res, 'Failed to fetch orders', error.message);
  }
}

const createReview = async (req, res) => {
  try {
    const review = await productService.createReview(req, req.body);
    return sendSuccess(res, 'Review created successfully', review);
  } catch (error) {
    return sendError(res, 'Failed to create review', error.message);
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await productService.getReviews(req.params.id);
    return sendSuccess(res, 'Reviews fetched successfully', reviews);
  } catch (error) {
    return sendError(res, 'Failed to fetch reviews', error.message);
  }
};


module.exports = {
    createProduct,
  updateProduct,  getProducts, deleteProduct,
  createOrder , getOrders, allOrders, createReview, getReviews
};