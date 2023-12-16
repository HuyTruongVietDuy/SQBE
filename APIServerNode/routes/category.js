var express = require('express');
var router = express.Router();
var categoryController = require("../Controllers/categoryController");


// Thêm 1 tên loại mới
router.post('/add', categoryController.AddCategory);

// Cập nhật 1 loại
router.put('/update/:id_loai', categoryController.UpdateCategory);

// Xóa 1 loại
router.delete('/delete/:id_loai', categoryController.DeleteCategory);

// Lấy danh sách trong loại
router.get('/', categoryController.GetCategories);




module.exports = router;
