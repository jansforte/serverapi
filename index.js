const express = require('express');
const cors = require('cors');
const mysqlConnection = require('./database');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

app.set("json spaces",2);
app.use('/files', express.static('files'));
app.use('/files', express.static('public'));

/*const credencials = {
    host:'localhost',
    user:'root',
    password:'',
    database:'crepids'
}*/


app.get('/',(req, res)=>{
    res.send('hola desde tu primera ruta de la api')
});

app.get('/listacalicar',(req, res)=>{
    var connection = mysqlConnection;
    connection.query("SELECT * FROM tbl_proystat ",(error, result)=>{
            if(error)
                res.status(500).send(error);
            else
                res.status(200).send(result);
        }
    );
    connection.end;
});

app.get('/listaDocentes/:all',(req, res)=>{
    
    var connection = mysqlConnection;    
    connection.query("SELECT a.codigoDocentex as value, CONCAT(a.nombreDocentex,' ',a.apelliDocentex,' - ',b.nombreEtapaxxx) as label"+
    " FROM tbl_docentex a LEFT JOIN tbl_etapaxxx b ON a.codigoEtapaxxx = b.codigoEtapaxxx ",(error, result)=>{
            if(error)
                res.status(500).send(error);
            else{
                res.status(200).send(result);
            }
        } 
    );
    connection.end;
});


//app.use(require('./routes/login'));

app.post('/register',(req,res)=>{
    console.log(req.body);
    //const {emailxUsuariox, clavexUsuariox} = req.body;
    const emailxUsuariox = req.body.email;
    const clavexUsuariox = req.body.clave;
    const nombreEstudnte = req.body.nombre;
    const apelliEstudnte = req.body.apellido;
    const codigoEstudnte = req.body.cedula;
    const fechaxNacimien = req.body.fNacimiento;
    const generoEstudnte = req.body.sexo;
    const direccEstudnte = req.body.direccion; 
    const numeroCelularx = req.body.celular;
    const nombreUsuariox = nombreEstudnte+" "+apelliEstudnte;
    const insertarEstudiante =[codigoEstudnte,nombreEstudnte,apelliEstudnte,generoEstudnte,fechaxNacimien,numeroCelularx,direccEstudnte,emailxUsuariox];
    const insertarUsuario = [emailxUsuariox, nombreUsuariox, clavexUsuariox];

    var estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    var connection = mysqlConnection;
    connection.query("START TRANSACTION",(error,result)=>{
        if(error){
            estado['message']=error;
            connection.query("ROLLBACK",(error,result)=>{});
            res.status(500).send(estado);
        }else{
            connection.query(
        "INSERT INTO tbl_estudnte (codigoEstudnte, nombreEstudnte, apelliEstudnte, generoEstudnte, fechaxNacimien, numeroCelularx, direccEstudnte, emailxUsuariox, fechaxRegistro)VALUES(?,NOW())",
        [insertarEstudiante],(error,result)=>{
            if(error){
                estado['message']='Su documento de identidad ya se encuentra registrado';
                connection.query("ROLLBACK",(error,result)=>{});
                res.status(500).send(estado);
            }else{
                connection.query(
                    "INSERT INTO tbl_usuarios (emailxUsuariox, nombreUsuariox, clavexUsuariox, codigoPerfilxx)VALUES(?,3)",
                    [insertarUsuario],(error,result)=>{
                        if(error){
                            estado['message']=error;
                            connection.query("ROLLBACK",(error,result)=>{});
                            res.status(500).send(estado);
                        }else{
                            estado['estado']=true;
                            connection.query("COMMIT",(error,result)=>{});
                            estado['message']="Usuario Registrado Correctamente";
                            res.status(200).send(estado);
                        }
                    });
            }
        });            
        }
    });
    connection.end;
});

app.use('/api/login',require('./routes/login'));
app.use('/api/proyecto',require('./routes/proyecto')); 
app.use('/api/asesorias',require('./routes/asesorias')); 
app.use('/api/events',require('./routes/eventos')); 
app.use('/api/offers',require('./routes/ofertas'));
app.use('/api/group',require('./routes/grupos'));



app.listen(4000,()=>console.log('Server API'));