const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');

var DIRECTORIO = "./files/";

const savePicture = multer.diskStorage({
    destination: function(req,file,cb){
        console.log(req.body);
        if(file){
            DIRECTORIO ='./files/events';
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
            cb(null,file.originalname)
        }
    }
});

const changePicture = multer({storage: savePicture});

router.post("/register",changePicture.single("archivEventoxx"),(req,res)=>{
    var connection = mysqlConnection;
    console.log("entra eventos");
    console.log(req.body);
    var {emailxUsuariox} = req.body;
    var  nombreEventoxx = req.body.nombreEventoxx;
    var  fechaxEventoxx = req.body.fechaxEventoxx;
    var  horainEventoxx = req.body.horainEventoxx;
    var  horafnEventoxx = req.body.horafnEventoxx;
    var  imagenEventoxx = req.body.nombreArchivox;
    var  descriEventoxx = req.body.descriEventoxx;
    
    const insert = [nombreEventoxx,imagenEventoxx,descriEventoxx,
                    fechaxEventoxx,horainEventoxx,horafnEventoxx, emailxUsuariox];
    //console.log(insert);
    var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("INSERT INTO tbl_eventoxx( "+
            "codigoAdminxxx, nombreEventoxx, imagenEventoxx, "+
            "descriEventoxx, fechaxEventoxx, horainEventoxx, "+
            "horafnEventoxx, usuariModifica, "+
            "fechaxModifica) VALUES ("+
            "1,?,NOW())",[insert],(error,result)=>{
        if(error){
            console.log(error);
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }else{
            
            estado['message']='El Cambio se realizó correctamente';
            estado['estado']=true;
            connection.query("COMMIT");
            console.log(estado);
            res.status(200).send(estado);
        }
    });
    connection.end; 
});

router.get("/getAll",(req,res)=>{
    var connection = mysqlConnection;
    connection.query("SELECT * FROM tbl_eventoxx ORDER BY 1 DESC",(error,result)=>{
        if(error){
          //  console.log(error);
            res.status(500).send(error);
        }
        if(result){
            //console.log(result);
            res.status(200).send(result);
        }
    });
    connection.end; 
});

router.get("/getIndex",(req,res)=>{
    var connection = mysqlConnection;
    const fecha = new Date();
    const yearActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1; 
    connection.query("SELECT * FROM tbl_eventoxx WHERE MONTH(fechaxEventoxx) >= ? AND YEAR(fechaxEventoxx) >= ? ORDER BY 1 DESC",[mesActual,yearActual],(error,result)=>{
        if(error){
          //  console.log(error);
            res.status(500).send(error);
        }
        if(result){
            
            res.status(200).send(result);
        }
    });
    connection.end; 
});

router.get("/getCalendar",(req,res)=>{
    var connection = mysqlConnection;
    const fecha = new Date();
    const yearActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1; 
    fecha.setMonth(mesActual+2);
    let dia = fecha.getDate()<10 ? '0'+fecha.getDate() : fecha.getDate();
    let mes = (fecha.getMonth()+1)<10 ? '0'+(fecha.getMonth()+1): (fecha.getMonth()+1);
    const fechaFutura = fecha.getFullYear()+'-'+mes+'-'+dia;

    connection.query("SELECT *, YEAR(fechaxEventoxx) as yearEvento, DAY(fechaxEventoxx) as dia_mes,"+
    "CASE MONTH(fechaxEventoxx) "+
    " WHEN 1 THEN 'Ene'"+
    " WHEN 2 THEN 'Feb'"+
    " WHEN 3 THEN 'Mar'"+
    " WHEN 4 THEN 'Abr'"+
    " WHEN 5 THEN 'May'"+
    " WHEN 6 THEN 'Jun'"+
    " WHEN 7 THEN 'Jul'"+
    " WHEN 8 THEN 'Ago'"+
    " WHEN 9 THEN 'Sep'"+
    " WHEN 10 THEN 'Oct'"+
    " WHEN 11 THEN 'Nov'"+
    " ELSE 'Dic' END nombre_mes"+

    " FROM tbl_eventoxx WHERE MONTH(fechaxEventoxx) >= ? AND YEAR(fechaxEventoxx) >= ? AND fechaxEventoxx < ? ORDER BY fechaxEventoxx ASC",[mesActual,yearActual,fechaFutura],(error,result)=>{
        if(error){
          //  console.log(error);
            res.status(500).send(error);
        }
        if(result){
            
            res.status(200).send(result);
        }
    });
    connection.end; 
});

router.delete("/:codigoEventoxx",(req,res)=>{
    var connection = mysqlConnection;
    var codigoEventoxx = req.params.codigoEventoxx;
    console.log(codigoEventoxx);
    var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("DELETE FROM tbl_eventoxx WHERE codigoEventoxx=?",[codigoEventoxx],(error,result)=>{
        if(error){
            estado['message']=error;
            console.log(error);
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }
        else if(result){
            estado['message']=result;
            estado['estado']=true;
            console.log(result);
            connection.query("COMMIT");
            res.status(200).send(estado);
        }
    });
    connection.end; 
});

router.put("/:codigoEventoxx",changePicture.single("archivEventoxx"),(req,res)=>{
    var connection = mysqlConnection;
    var codigoEventoxx = req.params.codigoEventoxx;
    var {emailxUsuariox} = req.body;
    var  nombreEventoxx = req.body.nombreEventoxx;
    var  fechaxEventoxx = req.body.fechaxEventoxx;
    var  horainEventoxx = req.body.horainEventoxx;
    var  horafnEventoxx = req.body.horafnEventoxx;
    var  imagenEventoxx = req.body.nombreArchivox;
    var  descriEventoxx = req.body.descriEventoxx;
    
    const update = [nombreEventoxx,descriEventoxx,
                    fechaxEventoxx,horainEventoxx,horafnEventoxx, emailxUsuariox,codigoEventoxx];
    const updatePic = [imagenEventoxx,codigoEventoxx];
    console.log(req.params);
    console.log(req.body);
    var estado = [{"estado":false, "message":"No se pudo Realizar la actualización"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("UPDATE tbl_eventoxx SET nombreEventoxx=?,"+
                    "descriEventoxx=?,fechaxEventoxx=?,"+
                    "horainEventoxx=?,horafnEventoxx=?,numeroEstadoxx=1,"+
                    "usuariModifica=?,fechaxModifica = NOW() "+
                    "WHERE codigoEventoxx=? ",[nombreEventoxx,descriEventoxx,
                        fechaxEventoxx,horainEventoxx,horafnEventoxx, emailxUsuariox,codigoEventoxx],(error,result)=>{
        if(error){
            estado['message']=error;
            console.log(error);
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }
        else if(result){
            if(imagenEventoxx){
                connection.query("UPDATE tbl_eventoxx SET imagenEventoxx=? WHERE codigoEventoxx=?",
                [imagenEventoxx,codigoEventoxx],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        console.log(error);
                        connection.query("ROLLBACK");
                        res.status(500).send(estado);
                    }else if(result){
                        console.log("con");
                        estado['message']=result;
                        estado['estado']=true;
                        console.log(result);
                        connection.query("COMMIT");
                        res.status(200).send(estado);
                    }
                })
            }
            else{
                console.log("sin");
                estado['message']=result;
                estado['estado']=true;
                console.log(result);
                connection.query("COMMIT");
                res.status(200).send(estado);
            }
            
        }
    });
    connection.end; 
});

/*
para verificar el token lo mandamos en el tercer parametro de la consulta que se haga
ejemplo: router.get('/:emailxUsuariox/proyecto',verifytoken,(req,res)=>{}) se manda por 
beaser token en postman 
*/
 
module.exports = router; 