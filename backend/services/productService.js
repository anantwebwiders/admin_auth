const productRepository = require('../repositories/productRepository');

const createProduct = async (productData) => {
  try {
    const product = await productRepository.create(productData);
    return product; // sirf raw data return karega
  } catch (error) {
    throw error; // controller handle karega
  }
};

const getProducts = async () => {
  try {
    const products = await productRepository.findAll();
    return products; // sirf raw data return karega
  } catch (error) {
    throw error; // controller handle karega
  }
};

const updateProduct = async (id, productData) => {
  try {
    const product = await productRepository.updateAndReturn(id, productData);
    return product; // sirf raw data return karega
  } catch (error) {
    throw error; // controller handle karega
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await productRepository.delete(id);
    return product; // sirf raw data return karega
  } catch (error) {
    throw error; // controller handle karega
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};
