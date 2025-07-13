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


module.exports = {
    createProduct,
  updateProduct,  getProducts, deleteProduct
};