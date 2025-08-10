const BaseRepository = require('./BaseRepository');
const { sendError } = require('../utils/helper');
const Review = require('../models/ReviewModel');

class ReviewRepository extends BaseRepository {
    constructor() {
        super(Review);
    }
}

module.exports = new ReviewRepository();