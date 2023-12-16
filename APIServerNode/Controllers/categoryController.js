var db = require("../models/database");

// Thêm tên loại
exports.AddCategory = function (req, res) {
  let data = req.body;

  let sql = 'INSERT INTO loai SET ?';
  db.query(sql, data, (err, result) => {
    if (err) {
      console.error(err);
      res.json({ "thong bao": "Lỗi chèn loại", err });
    } else {
      res.json({ "thong bao": "Đã chèn loại", "id_loai": result.insertId });
    }
  });
};
  
// Cập nhật tên loại
exports.UpdateCategory = function (req, res) {
  const categoryId = req.params.id_loai;
  const updatedData = req.body;

  let sql = 'UPDATE loai SET ? WHERE id_loai = ?';
  db.query(sql, [updatedData, categoryId], (err, result) => {
    if (err) {
      console.error(err);
      res.json({ "thong bao": "Lỗi cập nhật loại", err });
    } else {
      if (result.affectedRows === 0) {
        res.json({ "thong bao": "Không tìm thấy loại để cập nhật" });
      } else {
        res.json({ "thong bao": "Đã cập nhật loại" });
      }
    }
  });
};

// Lấy danh sách loại
exports.GetCategories = function (req, res) {
  let sql = 'SELECT * FROM loai';
  db.query(sql, (err, results) => {
    if (err) {
      res.json({ "thong bao": "Lỗi khi lấy danh sách loại", err });
    } else {
      res.json(results);
    }
  });
};

// Lấy 1 loại theo ID
exports.GetCategoryById = function (req, res) {
  const categoryId = req.params.id_loai;

  let sql = 'SELECT * FROM loai WHERE id_loai = ?';
  db.query(sql, [categoryId], (err, result) => {
    if (err) {
      res.status(500).json({ "thong bao": "Lỗi khi lấy loại theo ID", "loi": err });
    } else {
      res.json(result[0]); // Giả sử bạn chỉ mong đợi một kết quả
    }
  });
};


// Xóa 1 loại
exports.DeleteCategory = function (req, res) {
  const categoryId = req.params.id_loai;

  let sql = 'DELETE FROM loai WHERE id_loai = ?';
  db.query(sql, [categoryId], (err, result) => {
    if (err) {
      console.error(err);
      res.json({ "thong bao": "Lỗi xóa loại", err });
    } else {
      if (result.affectedRows === 0) {
        res.json({ "thong bao": "Không tìm thấy loại để xóa" });
      } else {
        res.json({ "thong bao": "Đã xóa loại" });
      }
    }
  });
};






