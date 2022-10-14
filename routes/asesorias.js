const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
 

router.post('/register',(req,res)=>{ 
    console.log(req.body);
    //const {emailxUsuariox, clavexUsuariox} = req.body;
    const emailxUsuariox = req.body.emailxUsuariox;
    const codigoDocentex = req.body.codigoDocentex;
    const descriAsesoria = req.body.descriAsesoria;
    const lunesxHorainic = req.body.lunesxHorainic;
    const lunesxHorafinx = req.body.lunesxHorafinx;
    const martesHorainic = req.body.martesHorainic;
    const martesHorafinx = req.body.martesHorafinx;
    const miercoHorainic = req.body.miercoHorainic;
    const miercoHorafinx = req.body.miercoHorafinx;
    const juevesHorainic = req.body.juevesHorainic;
    const juevesHorafinx = req.body.juevesHorafinx;
    const vierneHorainic = req.body.vierneHorainic;
    const vierneHorafinx = req.body.vierneHorafinx;
    
    let   codigoEstudnte = "";

    var estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    var connection = mysqlConnection;
 
    connection.query("SELECT codigoEstudnte FROM tbl_estudnte WHERE emailxUsuariox=?",[emailxUsuariox],(error,result)=>{
        if(result){
            console.log(result);
            codigoEstudnte = result[0]['codigoEstudnte'];
            connection.query("START TRANSACTION",(error,result)=>{
                if(error){
                    estado['message']=error;
                    connection.query("ROLLBACK",(error,result)=>{});
                    res.status(500).send(estado);
                }else{

                    connection.query("DELETE FROM tbl_estudisp WHERE codigoEstudnte =?",[codigoEstudnte]);
                    const tbl_estudisp = [codigoEstudnte,lunesxHorainic,lunesxHorafinx,martesHorainic,
                        martesHorafinx, miercoHorainic,miercoHorafinx,
                        juevesHorainic, juevesHorafinx, vierneHorainic,
                        vierneHorafinx];
                    connection.query(
                        "INSERT INTO tbl_estudisp(codigoEstudnte, lunesxHorainic, lunesxHorafinx, martesHorainic,"+
                        " martesHorafinx, miercoHorainic, miercoHorafinx, juevesHorainic, juevesHorafinx, vierneHorainic, vierneHorafinx)"+
                        " VALUES (?)",
                        [tbl_estudisp],(error,result)=>{
                            if(error){
                                estado['message']=error;
                                connection.query("ROLLBACK",(error,result)=>{});
                                res.status(500).send(estado);
                            }else{
                                const tbl_asesoria =[codigoDocentex, codigoEstudnte, descriAsesoria, 1, 1];
                                connection.query(
                                    "INSERT INTO tbl_asesoria(codigoDocentex, codigoEstudnte, descriAsesoria, numeroEstadoxx, estadoNotifica) VALUES(?)",
                                    [tbl_asesoria], (error,result)=>{
                                        if(error){
                                            console.log("aqui");
                                            estado['message']=error;
                                            connection.query("ROLLBACK",(error,result)=>{});
                                            res.status(500).send(estado);
                                        }else{
                                            estado['estado']=true;
                                            connection.query("COMMIT",(error,result)=>{});
                                            estado['message']="Asesoria solicitada Correctamente";  
                                            res.status(200).send(estado);
                                        } 
                                    }
                                )
                            }
                        });  
                }
            });
        }
    })
    connection.end; 
});  

router.get("/getSchedule/:emailxUsuariox/:profile",(req,res)=>{
    let connection = mysqlConnection; 
    const {emailxUsuariox,profile} = req.params;
    var estado = [{"estado":false, "message":"Error al consultar en la Base de Datos, intente más tarde"}];
    estado = estado[0];
    if(atob(profile,"base64")==3){
        
        search="codigoEstudnte";
        connection.query("SELECT a.* FROM tbl_estudisp a "
        +" LEFT JOIN tbl_estudnte b ON a.codigoEstudnte = b.codigoEstudnte WHERE emailxUsuariox = ?",[emailxUsuariox],(error,result)=>{
            if(error){
                estado['message']=error;
                res.status(500).send(estado);
            }else{
                res.status(200).send(result);
            }
        });

    }else{
        estado['message']="Error de Usuario";
        res.status(500).send(estado);
    }
});

router.get('/list/:emailxUsuariox/:profile', (req,res)=>{
    let connection = mysqlConnection;
    const {emailxUsuariox,profile} = req.params;
    var estado = [{"estado":false, "message":"Error al consultar en la Base de Datos, intente más tarde"}];
    estado = estado[0];
    let codigo="";
    let search="";
   // console.log(req.params);
    if(atob(profile,"base64")==3){
        
        search="codigoEstudnte";
        connection.query("SELECT codigoEstudnte FROM tbl_estudnte WHERE emailxUsuariox = ?",[emailxUsuariox],(error,result)=>{
            if(error){
                estado['message']=error;
                res.status(500).send(estado);
            }else{
                codigo = result[0].codigoEstudnte;
                connection.query("SELECT a.*, DATE_FORMAT(fechaxAsesoria,'%Y/%m/%d') as fecha,IF(a.numeroEstadoxx = 1,'En Proceso','Agendado') as estado, CONCAT(b.nombreDocentex,' ', b.apelliDocentex) as nombreDocentex "
                +" FROM tbl_asesoria a LEFT JOIN tbl_docentex b ON a.codigoDocentex = b.codigoDocentex "
                +" WHERE "+search+" = ? "+
                " AND IF(a.fechaxAsesoria IS NULL, 1=1, a.fechaxAsesoria >= CURDATE())",[codigo],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        res.status(500).send(estado);
                    }else{
                        res.status(200).send(result);
                    } 
                })
            }
        });

    }else{
        search="codigoDocentex";
        connection.query("SELECT codigoDocentex FROM tbl_docentex WHERE emailxUsuariox = ?",[emailxUsuariox],(error,result)=>{
            if(error){
                estado['message']=error;
                res.status(500).send(estado);
            }else{
                codigo = result[0].codigoDocentex;
                connection.query("SELECT a.*, DATE_FORMAT(fechaxAsesoria,'%Y/%m/%d') as fecha,IF(a.numeroEstadoxx = 1,'En Proceso','Agendado') as estado, CONCAT(b.nombreEstudnte,' ', b.apelliEstudnte) as nombreEstudnte, "
                +" b.emailxUsuariox as emailxEstudnte"
                +" FROM tbl_asesoria a LEFT JOIN tbl_estudnte b ON a.codigoEstudnte = b.codigoEstudnte "
                +" WHERE "+search+" = ? "+
                " AND IF(a.fechaxAsesoria IS NULL, 1=1, a.fechaxAsesoria >= CURDATE())",[codigo],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        res.status(500).send(estado);
                    }else{
                        res.status(200).send(result);
                    } 
                })
            }
        });
    }

});   
 

router.post('/updateAsesoria',(req,res)=>{
    console.log(req.body);
    const {fechaxAsesoria, horaxInicioxx,horaxFinalxxx,codigoGoogleID,codigoAsesoria} = req.body; 
    const emailxUsuariox = req.body.emailxUsuariox;
    const descriProyecto = req.body.descriProyecto;
    const codigoProyecto = req.body.codigoProyecto;

    console.log(fechaxAsesoria);
    console.log(horaxInicioxx);
    console.log(horaxFinalxxx);
    console.log(codigoGoogleID);
    console.log(codigoAsesoria);

    var estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    var connection = mysqlConnection;
    
    connection.query("START TRANSACTION",(error,result)=>{
        if(error){
            estado['message']=error;
            connection.query("ROLLBACK",(error,result)=>{});
            res.status(500).send(estado);
        }else{
            //console.log("aqui");
            connection.query(
                "UPDATE tbl_asesoria SET"+
                " numeroEstadoxx = 2, estadoNotifica = 2, "+
                " fechaxAsesoria = ?, horaxxInicioxx = ?, horaxxFinalxxx = ?,"+
                " codigoGoogleID = ? "+
                " WHERE codigoAsesoria = ?",
                [fechaxAsesoria,horaxInicioxx,horaxFinalxxx,codigoGoogleID, codigoAsesoria],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        connection.query("ROLLBACK",(error,result)=>{});
                        res.status(500).send(estado);
                    }else{
                        estado['estado']=true;
                        connection.query("COMMIT",(error,result)=>{});
                        estado['message']="Datos Registrados Correctamente";  
                        res.status(200).send(estado);
                    }
                });      
        }
    });
    connection.end;
    console.log("entra Asesoria");
});
/*
para verificar el token lo mandamos en el tercer parametro de la consulta que se haga
ejemplo: router.get('/:emailxUsuariox/proyecto',verifytoken,(req,res)=>{}) se manda por 
beaser token en postman 
*/
 
module.exports = router; 