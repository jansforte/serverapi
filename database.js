const mysql = require('mysql');

const credencials = {
    host:'sql10.freesqldatabase.com',
    user:'sql10511361',
    password:'vxfJyJNUux',
    database:'sql10511361',
    port:'3306'
}

const mysqlConnection = mysql.createConnection(credencials);

module.exports = mysqlConnection;