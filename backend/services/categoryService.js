const categoryRepository = require('../repositories/categoryRepository');
const { sendError , sendSuccess } = require('../utils/helper');

const createCategory = async (categoryData, res) => {
    try {
        const { name, description } = categoryData;
        console.log(name, description);
        const category = await categoryRepository.create({name, description});
        return category;
    } catch (error) {
        return sendError(error);
    }
};

const getCategories = async () => {
    try {
        const categories = await categoryRepository.findAll();
        return categories; // return only raw data
    } catch (error) {
        throw error; // let controller handle error
    }
};

const updateCategory = async (id, categoryData) => {
    try {
        const category = await categoryRepository.updateAndReturn(id, categoryData);
        return category; // raw data
    } catch (error) {
        throw error;
    }
};

const deleteCategory = async (id) => {
    try {
        const category = await categoryRepository.delete(id);
        return category; // raw data
    } catch (error) {
        throw error;
    }
};



module.exports = { createCategory, getCategories, updateCategory, deleteCategory };