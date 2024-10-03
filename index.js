const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const mysqlConnection = require('./database');
const app = express();
const { router: notifyRouter } = require('./routes/notify');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

app.set("json spaces",2);
app.use('/plantilla/asistencia', (req,res)=>{
    res.download('./plantilla/asistencia_evento.xlsx');
}); 
app.use('/files', express.static('files'));
app.use('/certificate_event/:user/:document',(req,res)=>{
    let {user,document} = req.params;
    res.download(`./files/${user}/certificates/${document}`);
});
//app.use('/files', express.static('public'));
app.use('/img', express.static('img'));
app.use('/video', express.static('video'));


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
    connection.query("SELECT a.codigoDocentex as value, CONCAT(a.nombreDocentex,' ',a.apelliDocentex) as label"+
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

app.get('/listaestudiantes',(req, res)=>{
    
    // Defining algorithm
    let result = crypto.createHash('sha256').update("12345").digest('hex');
    let mitad = Math.floor(result.length / 2);
    let primeraMitad = result.substring(0,mitad);
    let segundaMitad = result.substring(mitad,result.length);
    let nuevo = segundaMitad+""+primeraMitad;
    let final = nuevo.split("").reverse().join("");

    var connection = mysqlConnection;    
    connection.query("SELECT * FROM tbl_asesoria",(error, result)=>{
            if(error)
                res.status(500).send(error);
            else{
                res.status(200).send(result);
            } 
        } 
    ); 
    
    connection.end;
  //  res.status(200).send(final + " - "+result);
});

app.get('/listaEmprendedor',(req, res)=>{
    let connection = mysqlConnection;    
    connection.query("SELECT a.codigoTipoempr as value, nombreTipoempr as label\
     FROM tbl_tipoempr a WHERE numeroEstadoxx = 1",(error, result)=>{
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

function cifrado(texto){
    let result = crypto.createHash('sha256').update(""+texto).digest('hex');
    let mitad = Math.floor(result.length / 2);
    let primeraMitad = result.substring(0,mitad);
    let segundaMitad = result.substring(mitad,result.length);
    let nuevo = segundaMitad+""+primeraMitad;
    let final = nuevo.split("").reverse().join("");
    return final;
}

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
    const codigoTipoempr = req.body.codigoTipoempr ? req.body.codigoTipoempr : 3;
    let passCifrad = cifrado(clavexUsuariox);
    const nombreUsuariox = nombreEstudnte+" "+apelliEstudnte;
    const insertarEstudiante =[
        codigoEstudnte,nombreEstudnte,apelliEstudnte,generoEstudnte,
        fechaxNacimien,numeroCelularx,direccEstudnte,emailxUsuariox,codigoTipoempr];
    const insertarUsuario = [emailxUsuariox, nombreUsuariox, passCifrad];

    let estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    let connection = mysqlConnection;
    connection.query("START TRANSACTION",(error,result)=>{
        if(error){
            estado['message']="Error al conectar con el servidor, intente mas tarde";
            connection.query("ROLLBACK");
            res.status(200).send(estado);
        }else{
            connection.query(
        "INSERT INTO tbl_estudnte (codigoEstudnte, nombreEstudnte, apelliEstudnte, generoEstudnte,\
             fechaxNacimien, numeroCelularx, direccEstudnte, emailxUsuariox, codigoTipoempr, fechaxRegistro)VALUES(?,NOW())",
        [insertarEstudiante],(error,result)=>{
            if(error){
                estado['message']='Su documento de identidad ya se encuentra registrado';
                connection.query("ROLLBACK");
                res.status(200).send(estado);
            }else{
                connection.query(
                    "INSERT INTO tbl_usuarios (emailxUsuariox, nombreUsuariox, clavexUsuariox, codigoPerfilxx)VALUES(?,3)",
                    [insertarUsuario],(error,result)=>{
                        if(error){
                            estado['message']="El usuario ya se encuentra registrado";
                            connection.query("ROLLBACK");
                            res.status(200).send(estado);
                        }else{
                            estado['estado']=true;
                            connection.query("COMMIT");
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
app.use('/api/exito',require('./routes/casosExito'));
app.use('/api/evaluacion',require('./routes/evaluacion'));
//app.use('/api/notify', notifyRouter);
app.use('/api/master',require('./routes/maestro'));
app.use('/api/acta',require('./routes/actas'));
app.use('/api/aboutus',require('./routes/acerca'));

 
const port = 1000 || 4000;
app.listen(port,()=>console.log('Server API'));
