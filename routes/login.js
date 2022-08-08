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
}

router.post('/user',(req,res)=>{
    console.log(req.body);
    //const {emailxUsuariox, clavexUsuariox} = req.body;
    const emailxUsuariox = req.body.usuario;
    const clavexUsuariox = req.body.clave;
    var estado = [{"estado":false, "message":"El usuario no existe"}];
    estado = estado[0];

    var connection = mysqlConnection;
    connection.query("SELECT * FROM tbl_usuarios WHERE emailxUsuariox= ? ",
    [emailxUsuariox],
        (error, result)=>{
            if(error){
                estado['message']=error;
                res.status(500).send(estado);
            }
            else if(result[0] && result[0]['clavexUsuariox']===clavexUsuariox){
                const token = jwt.sign(
                    {email: result[0][emailxUsuariox]},
                    TOKEN_KEY,
                    {expiresIn: '2h'}
                   );
                let datos = {...result,token};
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
});

router.get('/users',(req,res)=>{
    var connection = mysqlConnection;
    connection.query("SELECT * FROM tbl_perfilxx",(error, result)=>{
            if(error)
                res.status(500).send(error);
            else
                res.status(200).send(result);
        }
    );
    connection.end;
});

/*
para verificar el token lo mandamos en el tercer parametro de la consulta que se haga
ejemplo: router.get('/:emailxUsuariox/proyecto',verifytoken,(req,res)=>{}) se manda por 
beaser token en postman 
*/

module.exports = router;