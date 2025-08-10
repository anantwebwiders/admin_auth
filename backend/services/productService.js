const productRepository = require('../repositories/productRepository');
const OrderRepository = require('../repositories/orderRepository');
const orderRepository = require('../repositories/orderRepository');
const ReviewRepository = require('../repositories/reviewRepository');
const couponRepository = require('../repositories/couponRepository');


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

const createOrder = async (req, data) => {
  try {
    const userId = req.userData.id;

    // Helper to generate unique order ID
    const generateOrderId = () => {
      return 'ORD' + Date.now(); // eg. ORD1691298309123
    };

    // Fetch product
    const product = await productRepository.findById(data.product_id);

    if (!product) {
      throw new Error("Product not found");
    }

    // Check stock availability
    if (product.stock < data.quantity) {
      throw new Error(`Insufficient stock. Only ${product.stock} available`);
    }

    // Calculate new stock
    const updatedStock = product.stock - data.quantity;

    // Update product stock
    await productRepository.update(data.product_id, { stock: updatedStock });

    // check if coupon
    if (data.coupon_id) {
      const coupon = await couponRepository.findById(data.coupon_id);
      if (!coupon) {
        throw new Error("Coupon not found");
      }
      if (coupon.discount_percent > 0) {
        const discountAmount = (data.quantity * product.price) * (coupon.discount_percent / 100);
        data.total_price = data.quantity * product.price - discountAmount;
      }
    }else{
      data.total_price = data.quantity * product.price;
    }

    // Prepare order data
    const orderData = {
      product_id: data.product_id,
      quantity: data.quantity,
      user_id: userId,
      shipping_address: data.shipping_address,
      total_price: data.total_price,
      order_id: generateOrderId(),
    };

    // Create order in DB
    const order = await orderRepository.create(orderData);

    // Response
    return {
      orderId: order.order_id,
      message: "Order placed successfully",
    };

  } catch (error) {
    throw error; // Let controller handle the error
  }
};



const getOrders = async (req) => {
  try {
    const userId = req.userData.id;
    const where = { user_id: userId };
    const orders = await orderRepository.findByWhere(where);
    return orders; // sirf raw data return karega
  } catch (error) {
    throw error; // controller handle karega
  }
};

const allOrders = async (req) => {
  try {
    const userRole = req.userData.role;

    // if (userRole === 'admin') {
    //   const orders = await orderRepository.findAll();
    //   return orders; // sirf raw data return karega
    // }else{
    //   const userId = req.userData.id;
    //   const where = { seller_id: userId };
    //   const orders = await orderRepository.findByWhere(where);
    //   return orders;
    // }

    const orders = await orderRepository.findAll();
    // console.log(orders);
    return orders; // sirf raw data return karega
  } catch (error) {
    throw error; // controller handle karega
  }
};

const createReview = async (req, data) => {
  try {
    const userId = req.userData.id;
    data.user_id = userId;
    const review = await ReviewRepository.create(data);
    return review; // sirf raw data return karega
  } catch (error) {
    throw error; // controller handle karega
  }
}

const getReviews = async (id) => {
  try {
    const reviews = await ReviewRepository.findByWhere({ product_id: id });
    return reviews; // sirf raw data return karega
  } catch (error) {
    throw error; // controller handle karega
  }
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createOrder,
  getOrders,
  allOrders,
  createReview,
  getReviews,
};
