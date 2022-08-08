const express = require('express');
const cors = require('cors');
const mysqlConnection = require('./database');
const app = express();

app.use(cors());
app.use(express.json());
app.set("json spaces",2);

/*const credencials = {
    host:'localhost',
    user:'root',
    password:'',
    database:'crepids'
}*/

app.get('/',(req, res)=>{
    res.send('hola desde tu primera ruta de la api')
});

app.use(require('./routes/login'));
app.use('/api/login',require('./routes/login'));

app.get('/:codigoPerfilxx',(req, res)=>{
    var connection = mysqlConnection;
    var {codigoPerfilxx} = req.params
    connection.query("SELECT * FROM tbl_perfilxx WHERE codigoPerfilxx = ?",[codigoPerfilxx],(error, result)=>{
            if(error)
                res.status(500).send(error);
            else
                res.status(200).send(result);
        }
    );
    connection.end;
});

app.listen(4000,()=>console.log('hola soy el servidor'));