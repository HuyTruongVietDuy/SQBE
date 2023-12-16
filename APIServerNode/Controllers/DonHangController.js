var db = require('../models/database');

// Lưu đơn hàng
exports.SaveDonHang = function (req, res) {
    let data = req.body;
    let sql = `INSERT INTO don_hang SET ?`;
    db.query(sql, data, function (err, data) {
        if(err) res.json({"id_dh":-1,"thông báo":"lỗi không lưu được đơn hàng", err})
        else{
            id_dh = data.insertId
            res.json({"id_dh": id_dh,"thông báo":"đã lưu đơn hàng"});
        }
    });
};

//Lưu chi tiết đơn hàng
exports.SaveChiTietDonHang = function (req, res) {
    let data  = req.body;
    let sql =  `INSERT INTO don_hang_chi_tiet SET ?`;
    db.query(sql, data, function (err, d) {
        if(err) res.json({"thông báo:" :"lỗi lưu sp",err})
        else res.json({"thông báo":"Đã lưu sp vào db", "id_sp":data.id_sp});
    })
};
