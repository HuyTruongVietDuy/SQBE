const productController = require("../Controllers/productController");
const upload = require("../models/upload");
const express = require('express');
const router = express.Router();

// Thêm sản phẩm và upload hình ảnh
router.post('/add', upload.single('hinh'), productController.AddProduct);

// Cập nhật sản phẩm với tải lên ảnh
router.put('/update/:id_sp', upload.single('hinh'), productController.UpdateProduct);

// Lấy id một sản phẩm
router.get('/:id_sp', productController.getdetailproduct);

// Lấy danh sách sản phẩm
router.get('/', productController.GetProducts);

// Lấy danh sách sản phẩm theo loại
router.get('/category/:id_loai', productController.GetProductsByCategory);

// Xóa sản phẩm
router.delete('/delete/:id_sp', productController.DeletePrdouct);

// Tìm kiếm sản phẩm theo tên
router.get('/search/:ten_sp', productController.SearchProductByName);

// Cấu hình để phục vụ tệp tĩnh từ thư mục 'uploads'
router.use('/uploads', express.static('uploads'));

module.exports = router;
