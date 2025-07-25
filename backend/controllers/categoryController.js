const categoryService = require('../services/categoryService');
const { sendSuccess, sendError } = require('../utils/helper');

const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body, res);
        return sendSuccess(res, 'Category created successfully', category);
    } catch (error) {
        return sendError(res, 'Failed to create category', error);
    }
};

const getcategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories(); // just get data
        return sendSuccess(res, 'Categories fetched successfully', categories); // send response here
    } catch (error) {
        return sendError(res, 'Failed to fetch categories', error);
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        return sendSuccess(res, 'Category updated successfully', category);
    } catch (error) {
        return sendError(res, 'Failed to update category', error);
    }
};


const deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        return sendSuccess(res, 'Category deleted successfully', category);
    } catch (error) {
        return sendError(res, 'Failed to delete category', error);
    }
};

module.exports = { createCategory, getcategories, updateCategory, deleteCategory };