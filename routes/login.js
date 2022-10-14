const {Router} = require('express');
const jwt = require('jsonwebtoken');
const router = Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');

var DIRECTORIO = "./files/";

const TOKEN_KEY = require('../verifytoken');

const verifytoken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(authHeader);
    if(token=-null)
        return res.status(401).send("Token requerido");
    jwt.verify(token, TOKEN_KEY, (err, user)=>{
    if(err) return res.status(403).send("Token invalid");
        console.log(user);
        neq. user = user;
        next();
    });
    connection.end;
}

const almacen = multer.diskStorage({
    destination: function(req,file,cb){
        if(file){
            
            DIRECTORIO ='./files/'+req.body.emailxEstudnte;
            if(fs.existsSync(DIRECTORIO)){
                console.log("existe"); 
            }else{
                fs.mkdirSync(DIRECTORIO,true);
                fs.chmod(DIRECTORIO, 0o777, (err) => {
                    if (err) throw err;
                    console.log('The permissions for file "my_file.txt" have been changed!');
                });
            }
            cb(null,DIRECTORIO);
        }
    },
    filename: function(req,file,cb){
        if(file){
            cb(null,file.originalname)
        }
    }
}); 
 
const actualizar = multer({storage: almacen});
  
router.post('/user',(req,res)=>{
    //console.log(req.body);
    //const {emailxUsuariox, clavexUsuariox} = req.body;
    const emailxUsuariox = req.body.email;
    const clavexUsuariox = req.body.password;
    var estado = [{"estado":false, "message":"El usuario no existe"}];
    estado = estado[0];

    var connection = mysqlConnection;
    connection.query("SELECT a.*, UPPER(a.nombreUsuariox) as username FROM tbl_usuarios a WHERE a.emailxUsuariox= ? ",
    [emailxUsuariox], 
        (error, result)=>{
            if(error){
                estado['message']=error;
                res.status(500).send(estado);
            }
            else if(result[0] && result[0]['clavexUsuariox']===clavexUsuariox){
                connection.query("UPDATE tbl_usuarios SET fechaxIngresox=NOW() WHERE emailxUsuariox=?",[emailxUsuariox]);
                const token = jwt.sign(
                    {email: result[0][emailxUsuariox]},
                    TOKEN_KEY,
                    {expiresIn: '2h'}
                   );
                let datos = {...result,token};
                datos[0]['clavexUsuariox'] = datos[0]['clavexUsuariox']='********';
                estado['estado']=true;
                estado['message']=datos;
                res.status(200).send(estado);
            }
            else if(result[0] && result[0]['clavexUsuariox']!=clavexUsuariox){
                estado['message']="Contraseña Incorrecta";
                res.status(200).send(estado);
            }
            else{
                res.status(200).send(estado);
            }
        });
        connection.end; 
});

router.post('/userEmail',(req,res)=>{
    //const {emailxUsuariox, clavexUsuariox} = req.body; 
    const emailxUsuariox = req.body.emailxUsuariox;
    const tokenxUsuariox = req.body.tokenxUsuariox ? req.body.tokenxUsuariox.substr(0, 249):0;
    var estado = [{"estado":2, "message":"El usuario no existe"}];
    estado = estado[0];

    var connection = mysqlConnection;
    connection.query("SELECT a.emailxUsuariox, a.codigoPerfilxx, a.clavexUsuariox, UPPER(a.nombreUsuariox) as username FROM tbl_usuarios a WHERE a.emailxUsuariox= ? ",
    [emailxUsuariox], 
        (error, result)=>{
            if(error){
                estado['message']=error;
                res.status(500).send(estado);
            }
            else if(result[0]){
                connection.query("UPDATE tbl_usuarios SET tokenxUsuariox=?,fechaxIngresox=NOW() WHERE emailxUsuariox=?",[tokenxUsuariox,emailxUsuariox]);
                const token = jwt.sign(
                    {email: result[0][emailxUsuariox]},
                    TOKEN_KEY,
                    {expiresIn: '2h'}
                   );
                let datos = {...result,token};
                datos[0]['clavexUsuariox'] = datos[0]['clavexUsuariox']='********';
                estado['estado']=1;
                estado['message']=datos;
                res.status(200).send(estado);
            }
            else{
                res.status(200).send(estado);
            }
        });
        connection.end; 
});

router.get('/activo/:email',(req,res)=>{
    var connection = mysqlConnection; 
    console.log(req.params); 
    var {email} = req.params
    connection.query("SELECT codigoPerfilxx as profile FROM tbl_usuarios WHERE emailxUsuariox = ?",[email],(error, result)=>{
            if(error)
                res.status(500).send(error);
            else
                res.status(200).send(result);
        }
    );
    connection.end; 
});          
        
router.get('/:email',(req,res)=>{
    var connection = mysqlConnection;
    var {email} = req.params;
    connection.query("SELECT * FROM tbl_estudnte WHERE emailxUsuariox = ?",[email],(error, result)=>{
            if(error)
                res.status(500).send(error);
            else
                res.status(200).send(result);
        }
    );
    connection.end;
});

router.get('/:emailxUsuariox/:codigoProfilex',(req,res)=>{
    var connection = mysqlConnection;
    var {emailxUsuariox,codigoProfilex} = req.params;
    console.log(req.params);
    if(atob(codigoProfilex,'base64')==2){
        connection.query("SELECT a.*,b.clavexUsuariox FROM tbl_docentex a LEFT JOIN tbl_usuarios b ON a.emailxUsuariox=b.emailxUsuariox WHERE a.emailxUsuariox = ?",[emailxUsuariox],(error, result)=>{
            if(error)
                res.status(500).send(error);
            else{
                var estado =[{'codigoEstudnte':0,'nombreEstudnte':0,'apelliEstudnte':0,'generoEstudnte':0,
                            'fechaxNacimien':0,'numeroCelularx':0,'direccEstudnte':0,'profesEstudnte':0,
                            'codigoEtapaxxx':0,'emailxUsuariox':0,'clavexUsuariox':0}];
                estado[0]['codigoEstudnte'] = result[0]['codigoDocentex']; 
                estado[0]['nombreEstudnte'] = result[0]['nombreDocentex'];
                estado[0]['apelliEstudnte'] = result[0]['apelliDocentex'];
                estado[0]['generoEstudnte'] = result[0]['generoDocentex'];
                estado[0]['fechaxNacimien'] = result[0]['fechaxNacimien'];
                estado[0]['numeroCelularx'] = result[0]['numeroCelularx'];
                estado[0]['direccEstudnte'] = result[0]['direccDocentex'];
                estado[0]['profesEstudnte'] = result[0]['profesDocentex'];
                estado[0]['codigoEtapaxxx'] = result[0]['codigoEtapaxxx'];
                estado[0]['emailxUsuariox'] = result[0]['emailxUsuariox'];
                estado[0]['clavexUsuariox'] = result[0]['clavexUsuariox'];
                res.status(200).send(estado[0]);
            }
        }
        );  
    }
    else if(atob(codigoProfilex,'base64')==3){
        connection.query("SELECT a.*,b.clavexUsuariox FROM tbl_estudnte a LEFT JOIN tbl_usuarios b ON a.emailxUsuariox=b.emailxUsuariox  WHERE a.emailxUsuariox = ? ",[emailxUsuariox],(error, result)=>{
            if(error)
                res.status(500).send(error);
            else
                res.status(200).send(result[0]);
        }
        );
    }
    connection.end;
});  

router.post("/updateDatas",actualizar.single("documeProyecto"),(req,res)=>{ 
    var connection = mysqlConnection;
    //let datosBody=JSON.parse(JSON.stringify(req.body));
    var {emailxUsuariox,codigoProfilex,nombreEstudnte,
        apelliEstudnte, codigoEstudnte,emailxEstudnte,
        fechaxNacimien, generoEstudnte,direccEstudnte,
        numeroCelularx, profesEstudnte, codigoEtapaxxx,
        clavexUsuariox} = req.body;
    const nombre=nombreEstudnte ? nombreEstudnte: 0;
    const apellido=apelliEstudnte ? apelliEstudnte: 0;
    const cedula=codigoEstudnte ? codigoEstudnte: 0;
    const email=emailxEstudnte ? emailxEstudnte: 0;
    const fecha=fechaxNacimien ? fechaxNacimien: 0;
    const genero=generoEstudnte ? generoEstudnte: 0;
    const direccion=direccEstudnte ? direccEstudnte: 0;
    const celular=numeroCelularx ? numeroCelularx: 0;
    const profesion=profesEstudnte ? profesEstudnte: 0;
    const etapax=codigoEtapaxxx ? codigoEtapaxxx: 0; 
    const clave=clavexUsuariox ? clavexUsuariox: 0;

    //console.log(datosBody);
   // console.log(datosBody[0].nombreDocentex);
    var estado = [{"estado":false, "message":"Error de Consulta"}];
    estado = estado[0];

    connection.query("START TRANSACTION",(error, result)=>{
        if(error){
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }else{
            
            if(atob(codigoProfilex,'base64')==2){
                let actualizarDatosD =[
                    nombre,apellido,email,fecha,genero, direccion, celular,profesion, etapax,cedula
                ];
                connection.query(
                    "UPDATE tbl_docentex SET "+
                        "nombreDocentex = ?, apelliDocentex = ?, emailxUsuariox = ?,"+
                        "fechaxNacimien = ?, generoDocentex = ?, direccDocentex = ?,"+
                        "numeroCelularx = ?, profesDocentex = ?, codigoEtapaxxx = ? "+
                "  WHERE codigoDocentex = ? ",actualizarDatosD,(error, result)=>{
                    if(error){
                        console.log("entra");
                        console.log(error);
                        estado['message']=error;
                        connection.query("ROLLBACK");
                        res.status(500).send(estado);
                    }
                    else{
                        connection.query(
                            "UPDATE tbl_usuarios SET "+
                                "clavexUsuariox = ? "+
                        "  WHERE emailxUsuariox = ? ",[clave,email],(error, result)=>{
                            if(error){
                                console.log("entra");
                                console.log(error);
                                estado['message']=error;
                                connection.query("ROLLBACK");
                                res.status(500).send(estado);
                            }else{
                                estado['estado']=true;
                                connection.query("COMMIT");
                                estado['message']="Usuario Actualizado Correctamente";
                                res.status(200).send(estado);
                            }
                        });
                    }
                }
                );  
            }
            else if(atob(codigoProfilex,'base64')==3){
                let actualizarDatosE =[
                    nombre,apellido,email,fecha,genero, direccion, celular,profesion,cedula
                ];
                connection.query(
                    "UPDATE tbl_estudnte SET "+
                        "nombreEstudnte = ?, apelliEstudnte = ?, emailxUsuariox = ?,"+
                        "fechaxNacimien = ?, generoEstudnte = ?, direccEstudnte = ?,"+
                        "numeroCelularx = ?, profesEstudnte = ? "+
                "  WHERE codigoEstudnte = ? ",actualizarDatosE,(error, result)=>{
                    if(error){ 
                        console.log("entra");
                        console.log(error);
                        estado['message']=error;
                        connection.query("ROLLBACK");
                        res.status(500).send(estado);
                    }
                    else{
                        
                        connection.query(
                            "UPDATE tbl_usuarios SET "+
                                "clavexUsuariox = ? "+
                        "  WHERE emailxUsuariox = ? ",[clave,email],(error, result)=>{
                            if(error){
                                estado['message']=error;
                                console.log("entra");
                                console.log(error);
                                connection.query("ROLLBACK");
                                res.status(500).send(estado);
                            }else{
                                estado['estado']=true;
                                connection.query("COMMIT");
                                estado['message']="Usuario Actualizado Correctamente";
                                res.status(200).send(estado);
                            }
                        }); 
                    }
                }
                );
            }
        }
    });
    
    connection.end;
}) 
 
router.post("/registerTeacher",(req,res)=>{
    
    const{codigoDocentex, codigoEtapax, nombreDocentex,
        apelliDocentex, generoDocentex, fechaxNacimien,
        numeroCelularx, direccDocentex, emailxDocentex,
        profesDocentex, emailxUsuariox, clavexUsuariox
    } = req.body;
    
    const nombreUsuariox = nombreDocentex+" "+apelliDocentex;
    
    var estado = [{"estado":2, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];

    var connection = mysqlConnection;  
    connection.query("START TRANSACTION",(error,result)=>{
        if(error){
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }else{
            connection.query("SELECT codigoAdminxxx FROM tbl_adminxxx WHERE emailxUsuariox = ?",[emailxUsuariox],(error,result2)=>{
                if(error){
                    estado['message']=error;
                    connection.query("ROLLBACK");
                    res.status(500).send(estado);
                }else{
                    
                    const codigoAdminxxx = result2[0]['codigoAdminxxx'];
                    
                    const insertDocentex = 
                    [codigoDocentex, codigoAdminxxx, codigoEtapax, nombreDocentex,
                    apelliDocentex, generoDocentex, fechaxNacimien,
                    profesDocentex, numeroCelularx, direccDocentex, emailxDocentex];

                    connection.query(
                        "INSERT INTO tbl_docentex("+
                            "codigoDocentex, codigoAdminxxx, codigoEtapaxxx, "+
                            "nombreDocentex, apelliDocentex, generoDocentex, "+
                            "fechaxNacimien, profesDocentex, numeroCelularx, "+
                            "direccDocentex, emailxUsuariox, fechaxRegistro) VALUES (?,NOW())",
                        [insertDocentex],(error,result)=>{
                            if(error){
                                estado['message']=error;
                                connection.query("ROLLBACK");
                                res.status(500).send(estado);
                            }else{
                                const insertarUsuario = [emailxDocentex,nombreUsuariox,clavexUsuariox ]
                                connection.query(
                                    "INSERT INTO tbl_usuarios (emailxUsuariox, nombreUsuariox, clavexUsuariox, codigoPerfilxx)VALUES(?,2)",
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
                        }
                    );
                }
            });
            
        }
    });

})
/*
para verificar el token lo mandamos en el tercer parametro de la consulta que se haga
ejemplo: router.get('/:emailxUsuariox/proyecto',verifytoken,(req,res)=>{}) se manda por 
beaser token en postman 
*/

module.exports = router;     