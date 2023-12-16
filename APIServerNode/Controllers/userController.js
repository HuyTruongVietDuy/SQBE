var db = require("../models/database");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = process.env.PRIVATE_KEY || fs.readFileSync('private-key.txt');

exports.DangNhap = function(req, res){
    const un = req.body.un;
    const pw = req.body.pw;
    console.log('Nhận thông tin đăng nhập:', un, pw);

    // Truy vấn cơ sở dữ liệu để kiểm tra thông tin đăng nhập của người dùng
    db.query('SELECT * FROM user WHERE taikhoan = ? AND matkhau = ?', [un, pw], (error, results) => {
        if (error) {
            console.error('Lỗi cơ sở dữ liệu:', error);
            res.status(500).json({ "thông_báo": "Lỗi trong quá trình xử lý đăng nhập" });
        } else {
            if (results.length > 0) {
                const userId = results[0].id_user.toString(); // Đảm bảo userId là một chuỗi
                // Trong trường hợp thông tin `taikhoan` được trả về từ cơ sở dữ liệu
                const userInfo = { id: userId, taikhoan: results[0].taikhoan, role: results[0].role };

                
                
                // Thêm role trực tiếp vào payload của JWT
                const jwtBearerToken = jwt.sign(
                    { sub: userId, role: results[0].role },
                    PRIVATE_KEY,
                    { algorithm: 'RS256', expiresIn: 120 }
                );

                res.status(200).json({ token: jwtBearerToken, expiresIn: 120, userInfo: userInfo });
            } else {
                // Thông báo đăng nhập thất bại nếu không có dữ liệu trả về
                res.status(401).json({ "thông_báo": "Tài khoản hoặc mật khẩu không đúng" });
            }
        }
    });
}

exports.DangKy = function(req, res){
    const { taikhoan, matkhau, email } = req.body;

    if (!taikhoan || !matkhau || !email) {
        return res.status(400).json({ "thông_báo": "Vui lòng điền đầy đủ thông tin đăng ký." });
    }

    if (matkhau !== req.body.confirmPassword) {
        return res.status(400).json({ "thông_báo": "Xác nhận mật khẩu không đúng." });
    }

    db.query('SELECT * FROM user WHERE taikhoan = ?', [taikhoan], (error, results) => {
        if (error) {
            console.error('Lỗi cơ sở dữ liệu:', error);
            return res.status(500).json({ "thông_báo": "Lỗi trong quá trình xử lý đăng ký" });
        }

        if (results.length > 0) {
            return res.status(409).json({ "thông_báo": "Tài khoản đã tồn tại. Vui lòng chọn tài khoản khác." });
        }

        db.query('INSERT INTO user (taikhoan, matkhau, email) VALUES (?, ?, ?)', [taikhoan, matkhau, email], (error, results) => {
            if (error) {
                console.error('Lỗi cơ sở dữ liệu:', error);
                return res.status(500).json({ "thông_báo": "Lỗi trong quá trình xử lý đăng ký" });
            }

            const userId = results.insertId.toString();
            const userInfo = { id: userId, taikhoan, role: 'user' };

            const jwtBearerToken = jwt.sign(
                { sub: userId, role: 'user' },
                PRIVATE_KEY,
                { algorithm: 'RS256', expiresIn: 120 }
            );

            res.status(201).json({ token: jwtBearerToken, expiresIn: 120, userInfo });
        });
    });
}