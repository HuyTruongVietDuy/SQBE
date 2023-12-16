var db = require("../models/database");
var fs = require('fs');
// thêm sản phẩm và xử lý hình ảnh
exports.AddProduct = function (req, res) {
  let data = req.body;
  data.hinh = req.file.filename; // Lấy tên file hình ảnh từ multer

  let sql = 'INSERT INTO sanpham SET ?';
  db.query(sql, data, (err, data) => {
    if (err) {
      // Xóa tệp hình ảnh nếu có lỗi
      fs.unlinkSync('uploads/' + req.file.filename);
      res.json({ "thong bao": "lỗi chèn 1 sp", err });
    } else {
      res.json({ "thong bao": "Đã chèn 1 sp", "id_sp": data.insertId });
    }
  });
};

// cập nhật 1 sản phẩm với hình ảnh
exports.UpdateProduct = function (req, res) {
  let data = req.body;
  let id = req.params.id_sp;

  // Kiểm tra xem có ảnh mới được tải lên không
  if (req.file) {
      data.hinh = req.file.filename; // Cập nhật tên tệp ảnh trong dữ liệu
  }

  let sql = 'UPDATE sanpham SET ? where id_sp = ?';
  db.query(sql, [data, id], (err, d) => {
      if (err) {
          // Xóa ảnh đã tải lên nếu có lỗi
          if (req.file) {
              fs.unlinkSync('uploads/' + req.file.filename);
          }
          res.json({ "thông báo": "Lỗi cập nhật sp", err });
      } else {
          res.json({ "thông báo": "Đã cập nhật sp" });
      }
  });
};
  

// lấy chi tiết sản phẩm
exports.getdetailproduct = function (req, res) {
  let id = parseInt(req.params.id_sp);
  if (id <= 0) {
    res.json({ "thong bao": "không biết sản phẩm", id: id });
    return;
  }
  let sql = `SELECT * FROM sanpham WHERE id_sp = ?`;
  db.query(sql, id, (err, data) => {
    if (err) {
      res.json({ "thong bao": "lỗi lấy 1 sp", err });
    } else {
      res.json(data[0]);
    }
  });
};

// Lấy Danh Sách sản phẩm với lọc giá
exports.GetProducts = function (req, res) {
  // Lấy thông tin về khoảng giá từ query parameters
  const priceRange = req.query.priceRange;

  // Xây dựng câu truy vấn dựa trên khoảng giá nếu có
  let sql = 'SELECT sanpham.*, loai.ten_loai FROM sanpham JOIN loai ON sanpham.id_loai = loai.id_loai';

  if (priceRange) {
    switch (priceRange) {
      case '1':
        sql += ' WHERE sanpham.gia < 100000';
        break;
      case '2':
        sql += ' WHERE sanpham.gia BETWEEN 100000 AND 300000';
        break;
      case '3':
        sql += ' WHERE sanpham.gia BETWEEN 300000 AND 500000';
        break;
      case '4':
        sql += ' WHERE sanpham.gia > 600000';
        break;
      default:
        break;
    }
  }

  db.query(sql, (err, results) => {
    if (err) {
      res.json({ "thong bao": "Lỗi khi lấy danh sách san pham", err });
    } else {
      res.json(results);
    }
  });
};


// xóa một sản phẩm
exports.DeletePrdouct = function (req, res) {
  let id = req.params.id_sp;

  // Lấy tên file hình ảnh của sản phẩm trước khi xóa
  let getImageSql = 'SELECT hinh FROM sanpham WHERE id_sp = ?';
  db.query(getImageSql, id, (err, result) => {
    if (err) {
      res.json({ "thong bao": "Lỗi khi lấy tên hình ảnh", err });
      return;
    }

    // Thực hiện xóa sản phẩm
    let deleteProductSql = `DELETE FROM sanpham WHERE id_sp = ?`;
    db.query(deleteProductSql, id, (err, d) => {
      if (err) {
        res.json({ "Thông báo": "Lỗi khi xóa sản phẩm", err });
      } else {
        // Xóa hình ảnh từ thư mục 'uploads' sau khi xóa sản phẩm
        if (result && result.length > 0) {
          const imagePath = 'uploads/' + result[0].hinh;
          fs.unlinkSync(imagePath);
        }

        res.json({ "thông báo": "Đã xóa sản phẩm" });
      }
    });
  });
};

// Lấy danh sách sản phẩm theo loại
exports.GetProductsByCategory = function (req, res) {
  const categoryId = req.params.id_loai;
  const priceRange = req.query.priceRange;
  // Xây dựng câu truy vấn
  let sql = 'SELECT * FROM sanpham WHERE id_loai = ?';
  if (priceRange) {
    switch (priceRange) {
      case '1':
        sql += ' WHERE sanpham.gia < 100000';
        break;
      case '2':
        sql += ' WHERE sanpham.gia BETWEEN 100000 AND 300000';
        break;
      case '3':
        sql += ' WHERE sanpham.gia BETWEEN 300000 AND 500000';
        break;
      case '4':
        sql += ' WHERE sanpham.gia > 600000';
        break;
      default:
        break;
    }
  }
  db.query(sql, categoryId, (err, results) => {
    if (err) {
      res.json({ "thong bao": "Lỗi khi lấy danh sách sản phẩm theo loại", err });
    } else {  
      res.json(results);
    }
  });
}

// controller/productcontroller.js
// Tìm kiếm sản phẩm theo tên
exports.SearchProductByName = function (req, res) {
  const productName = req.params.ten_sp;

  // Xây dựng câu truy vấn
  let sql = 'SELECT * FROM sanpham WHERE ten_sp LIKE ?';
  db.query(sql, [`%${productName}%`], (err, results) => {
    if (err) {
      res.json({ "thong_bao": "Lỗi khi tìm kiếm sản phẩm theo tên", "err": err });
    } else {
      res.json(results);
    }
  });
};
