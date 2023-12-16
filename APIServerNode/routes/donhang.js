var express = require('express');
var router = express.Router();
var DonHangController = require('../Controllers/DonHangController');

// lưu đơn hàng
// // http://localhost:4000/donhang/luudonhang/
router.post('/luudonhang/', DonHangController.SaveDonHang)

// lưu chi tiết đơn hàng
// // http://localhost:4000/donhang/luugiohang/
router.post('/luugiohang',DonHangController.SaveChiTietDonHang)



module.exports = router;
