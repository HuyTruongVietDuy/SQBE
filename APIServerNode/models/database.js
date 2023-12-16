//Database trả về kết nối với cơ sở dữ liệu
var mysql = require('mysql');
var db = mysql.createConnection({
   host: 'localhost',
   user: 'root', 
   password: '', 
   database: 'sqbe-react'
}); 
db.connect(() => console.log('Da ket noi database !'));
module.exports = db; 

