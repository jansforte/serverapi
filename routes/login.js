const {Router} = require('express');
const jwt = require('jsonwebtoken');
const router = Router();
const mysqlConnection = require('../database');

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
            connection.query("SELECT codigoAdminxxx FROM tbl_adminxxx WHERE emailxUsuariox = ?",[emailxUsuariox],(error,result)=>{
                if(error){
                    estado['message']=error;
                    connection.query("ROLLBACK");
                    res.status(500).send(estado);
                }else{
                    const codigoAdminxxx = result[0][codigoAdminxxx];
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