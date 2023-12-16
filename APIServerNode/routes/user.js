var express = require('express');
var router = express.Router();
var UserController = require('../Controllers/userController');


// Thêm middleware để phân tích cơ thể yêu cầu
router.use(express.json());

//dangnhap
router.post('/login',UserController.DangNhap );

//dangky
router.post('/register', UserController.DangKy);

module.exports = router;
