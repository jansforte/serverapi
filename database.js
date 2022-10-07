const mysql = require('mysql');

const credencials = {
    host:'remotemysql.com',
    user:'VIbrimMy5a',
    password:'WfpsC3j6At',
    database:'VIbrimMy5a',
    port: '3306'
}

const mysqlConnection = mysql.createConnection(credencials);

module.exports = mysqlConnection;