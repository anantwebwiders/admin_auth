const BaseRepository = require('./BaseRepository');
const { sendError } = require('../utils/helper');
const Coupon = require('../models/CouponModel');

class CouponRepository extends BaseRepository {
    constructor() {
        super(Coupon);
    }
}

module.exports = new CouponRepository();