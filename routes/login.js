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

const savePicture = multer.diskStorage({
    destination: function(req,file,cb){
        console.log(req.body);
        if(file){
            DIRECTORIO ='./files/'+req.body.emailxUsuariox;
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
        console.log(req.body);
        if(file){
            cb(null,'pictureProfile.png')
        }
    }
}); 
 
const changePicture = multer({storage: savePicture});
 
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
    connection.query("SELECT a.emailxUsuariox, a.codigoPerfilxx, a.clavexUsuariox, UPPER(a.nombreUsuariox) as username,a.picturUsuariox FROM tbl_usuarios a WHERE a.emailxUsuariox= ? ",
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
    connection.end;
})  

router.post("/changePicture",changePicture.single("filePicture"),(req,res)=>{
    var connection = mysqlConnection;
    var {emailxUsuariox} = req.body;
    var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION",(error,result)=>{
        if(error){
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(200).send(estado);
        }else{
            connection.query("UPDATE tbl_usuarios SET picturUsuariox = '1' WHERE emailxUsuariox = ?",[emailxUsuariox],(error,result)=>{
                if(error){
                    estado['message']=error;
                    connection.query("ROLLBACK");
                    res.status(200).send(estado);
                }else{
                    estado['message']='El Cambio se realizó correctamente';
                    estado['estado']=true;
                    connection.query("COMMIT");
                    res.status(200).send(estado);
                }
            })
        }
    });
    connection.end; 
})

router.get("/getAllUsers/1/all",(req,res)=>{
    const connection = mysqlConnection;
    const {f_codigoPerfilxx,f_codigoEtapaxxx,f_buscador} = req.query;
    
    let f_tipoxOrdenxxx = req.params.tipoxOrdenxxx ? req.params.tipoxOrdenxxx : 'ASC'; 
    if(!f_codigoPerfilxx){
    //nombreUsuario, tipoUsuario, etapa
        let condicEtapad = "";
        let condicEtapae = "";
        if(f_codigoEtapaxxx){
            condicEtapad = " AND a.codigoEtapaxxx = "+f_codigoEtapaxxx;
            condicEtapae = " AND c.codigoEtapaxxx = "+f_codigoEtapaxxx;
        }

        let consultaBuscadord="";
        let consultaBuscadore="";
        if(f_buscador){
            consultaBuscadord=" AND (a.nombreDocentex LIKE '%"+f_buscador+"%' OR a.apelliDocentex LIKE '%"+f_buscador+"%' "+
            " OR a.emailxUsuariox LIKE '%"+f_buscador+"%' OR a.profesDocentex LIKE '%"+f_buscador+"%' OR a.codigoDocentex LIKE '%"+f_buscador+"%' ) ";
            consultaBuscadore=" AND (a.nombreEstudnte LIKE '%"+f_buscador+"%' OR a.apelliEstudnte LIKE '%"+f_buscador+"%' "+
            " OR a.emailxUsuariox LIKE '%"+f_buscador+"%' OR a.profesEstudnte LIKE '%"+f_buscador+"%' OR a.codigoEstudnte LIKE '%"+f_buscador+"%' ) ";
        }

        let filtroDocentex = "SELECT UPPER(a.nombreDocentex) as nombreBusqueda, UPPER(a.apelliDocentex) as apelliBusqueda, a.codigoEtapaxxx, "+
        "a.generoDocentex as generoBusqueda, a.fechaxNacimien, a.profesDocentex as profesBusqueda, "+
        "a.numeroCelularx, a.emailxUsuariox, a.codigoDocentex as codigoBusqueda, b.nombreUsuariox, 'Docente' as codigoPerfilxx "+
        "FROM tbl_docentex a LEFT JOIN tbl_usuarios b ON a.emailxUsuariox = b.emailxUsuariox "+
        "WHERE 1 = 1 "+condicEtapad + consultaBuscadord;
        let filtroEstudnte = "SELECT UPPER(a.nombreEstudnte) as nombreBusqueda, UPPER(a.apelliEstudnte) as apelliBusqueda, IF(c.codigoEtapaxxx IS NULL,'N/A', c.codigoEtapaxxx) codigoEtapaxxx, "+
        "a.generoEstudnte as generoBusqueda, a.fechaxNacimien, a.profesEstudnte as profesBusqueda, "+
        "a.numeroCelularx, a.emailxUsuariox, a.codigoEstudnte as codigoBusqueda, b.nombreUsuariox, 'Estudiante' as codigoPerfilxx "+
        "FROM tbl_estudnte a LEFT JOIN tbl_usuarios b ON a.emailxUsuariox = b.emailxUsuariox "+
        " LEFT JOIN tbl_proyecto c ON a.codigoEstudnte = c.codigoEstudnte"+
        "WHERE 1 = 1 "+condicEtapae+ consultaBuscadore+
        " ORDER BY codigoBusqueda "+f_tipoxOrdenxxx;
        connection.query(
            filtroDocentex+" UNION "+filtroEstudnte
            ,(error,result)=>{
                if(result){
                    res.status(200).send(result);
                }else{
                    res.status(200).send(false);
                }
            });
    }
    else if(f_codigoPerfilxx){
        let condicEtapad = "";
        let condicEtapae = "";
        if(f_codigoEtapaxxx){
            condicEtapad = " AND a.codigoEtapaxxx = "+f_codigoEtapaxxx;
            condicEtapae = " AND c.codigoEtapaxxx = "+f_codigoEtapaxxx;
        }
        let conde = condicEtapad;
        let tabla = "docentex";
        let colum = "Docentex";
        let tipou = "Docente";
        let leftj = "";
        let colef = "a.codigoEtapaxxx";
        if(f_codigoPerfilxx==3){
            tabla = "estudnte";
            colum = "Estudnte";
            tipou = "Estudiante";
            leftj = "LEFT JOIN tbl_proyecto c ON a.codigoEstudnte = c.codigoEstudnte";
            colef = "IF(c.codigoEtapaxxx IS NULL,'N/A', c.codigoEtapaxxx)";
            conde = condicEtapae;
        }
        
        let consultaBuscador="";
        if(f_buscador){
            consultaBuscador=" AND (a.nombre"+colum+" LIKE '%"+f_buscador+"%' OR a.apelli"+colum+" LIKE '%"+f_buscador+"%' "+
            " OR a.emailxUsuariox LIKE '%"+f_buscador+"%' OR a.profes"+colum+" LIKE '%"+f_buscador+"%' OR a.codigo"+colum+" LIKE '%"+f_buscador+"%' ) ";
        }

        let filtroBusqueda = "SELECT UPPER(a.nombre"+colum+") as nombreBusqueda, UPPER(a.apelli"+colum+") as apelliBusqueda, "+colef+" as codigoEtapaxxx, "+
        "a.genero"+colum+" as generoBusqueda, a.fechaxNacimien, a.profes"+colum+" as profesBusqueda, "+
        "a.numeroCelularx, a.emailxUsuariox, a.codigo"+colum+" as codigoBusqueda, b.nombreUsuariox, '"+tipou+"' as codigoPerfilxx "+
        "FROM tbl_"+tabla+" a LEFT JOIN tbl_usuarios b ON a.emailxUsuariox = b.emailxUsuariox "+leftj+
        " WHERE 1 = 1 "+conde+consultaBuscador+
        " ORDER BY codigoBusqueda "+f_tipoxOrdenxxx;
        connection.query(filtroBusqueda,(error,result)=>{
            if(result){
                res.status(200).send(result);
            }else{
                res.status(200).send(false);
            }
        })
    }
    connection.end;
});

router.get("/getNotify/profile/:emailxUsuariox/:profile",(req,res)=>{
    const connection = mysqlConnection;
    const {emailxUsuariox,profile} = req.params;
    if(atob(profile,'base64')==2){
        connection.query("SELECT a.* FROM tbl_histnoti a LEFT JOIN tbl_docentex b ON a.codigoUsuariox = b.codigoDocentex "+
        " WHERE b.emailxUsuariox = ? ",[emailxUsuariox],(error,result)=>{
            if(result){
                res.status(200).send(result);
            }else{
                res.status(200).send(false);
            }
        });
    }else if(atob(profile,'base64')==3){
        connection.query("SELECT a.* FROM tbl_histnoti a LEFT JOIN tbl_estudnte b ON a.codigoUsuariox = b.codigoEstudnte "+
        " WHERE b.emailxUsuariox = ? AND a.estadoNotifica != 1 ORDER BY a.fechaxCreacion ASC",[emailxUsuariox],(error,result)=>{
            if(result){
                res.status(200).send(result);
            }else{
                res.status(200).send(false);
            }
        });
    }else{
        res.status(200).send(false);
    }
    connection.end;
});

router.put("/updateNotify/:codigoHistnoti",(req,res)=>{
    let connection = mysqlConnection;
    const {codigoHistnoti} = req.params;
    if(codigoHistnoti){
        connection.query("START TRANSACTION");
        connection.query("UPDATE tbl_histnoti SET estadoNotifica=1 WHERE codigoHistnoti = ?",[codigoHistnoti],(error,result)=>{
            if(error){
                connection.query("ROLLBACK");
                res.status(200).send(false);
            }else{
                connection.query("COMMIT");
                res.status(200).send(true);
            }
        })
    }
    else{
        res.status(500).send(false);
    }
    connection.end;
});
/*
para verificar el token lo mandamos en el tercer parametro de la consulta que se haga
ejemplo: router.get('/:emailxUsuariox/proyecto',verifytoken,(req,res)=>{}) se manda por 
beaser token en postman 
*/

module.exports = router;     