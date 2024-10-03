const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
const {notifyAsesorias} = require('./notify');
 

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
    let   nombreEstudnte = "";

    var estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    var connection = mysqlConnection;
 
    connection.query("SELECT codigoEstudnte, nombreEstudnte, apelliEstudnte FROM tbl_estudnte WHERE emailxUsuariox=?",[emailxUsuariox],(error,result)=>{
        if(result){
            console.log(result);
            codigoEstudnte = result[0]['codigoEstudnte'];
            nombreEstudnte = result[0]['nombreEstudnte']+' '+result[0]['apelliEstudnte'];
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
                                connection.query("ROLLBACK");
                                res.status(500).send(estado);
                            }else{
                                const tbl_asesoria =[codigoDocentex, codigoEstudnte, descriAsesoria, 1, 1];
                                connection.query(
                                    "INSERT INTO tbl_asesoria(codigoDocentex, codigoEstudnte, descriAsesoria, numeroEstadoxx, estadoNotifica) VALUES(?)",
                                    [tbl_asesoria], (error,result)=>{
                                        if(error){
                                            console.log("aqui");
                                            estado['message']=error;
                                            connection.query("ROLLBACK");
                                            res.status(500).send(estado);
                                        }else{
                                            const tbl_histnoti = [codigoDocentex,'Solicitud de Asesoria','El estudiante '+nombreEstudnte+' te pidió una solicitud de Asesoria','meet'];
                                            connection.query("INSERT INTO tbl_histnoti(codigoUsuariox, nombreNotifica, descriNotifica, tipoxxNotifica, fechaxCreacion) VALUES (?,NOW())",[tbl_histnoti]);
                                            estado['estado']=true;
                                            connection.query("COMMIT");
                                            estado['message']="Asesoria solicitada Correctamente";  
                                            codigoAsesoria = result.insertId;
                                            notifyAsesorias(codigoAsesoria,1);
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
    let estado = [{"estado":false, "message":"Error al consultar en la Base de Datos, intente más tarde"}];
    estado = estado[0];
    if(atob(profile,"base64")==3 || atob(profile,"base64")==2){
        
        search="codigoEstudnte";
        let consulta=
        'CONCAT(COALESCE(lunesxHorainic,"--:--")," a ",COALESCE(lunesxHorafinx,"--:--")) as lunes, '+
        'CONCAT(COALESCE(martesHorainic,"--:--")," a ",COALESCE(martesHorafinx,"--:--")) as martes, '+
        'CONCAT(COALESCE(miercoHorainic,"--:--")," a ",COALESCE(miercoHorafinx,"--:--")) as miercoles, '+
        'CONCAT(COALESCE(juevesHorainic,"--:--")," a ",COALESCE(juevesHorafinx,"--:--")) as jueves, '+
        'CONCAT(COALESCE(vierneHorainic,"--:--")," a ",COALESCE(vierneHorafinx,"--:--")) as viernes ';
        connection.query("SELECT "+consulta+",a.* FROM tbl_estudisp a "
        +" LEFT JOIN tbl_estudnte b ON a.codigoEstudnte = b.codigoEstudnte WHERE emailxUsuariox = ? LIMIT 1",[emailxUsuariox],(error,result)=>{
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
                connection.query("SELECT a.*,\
                DATE_FORMAT(fechaxAsesoria,'%Y/%m/%d') as fecha,\
                CASE \
                    WHEN a.numeroEstadoxx = 1 THEN 'En Proceso'\
                    WHEN a.numeroEstadoxx = 4 THEN 'Pendiente de cambio/cancelación'\
                    ELSE 'Agendado'\
                END as estado,\
                CONCAT(b.nombreDocentex,' ', b.apelliDocentex) as nombreDocentex "
                +" FROM tbl_asesoria a LEFT JOIN tbl_docentex b ON a.codigoDocentex = b.codigoDocentex "
                +" WHERE "+search+" = ? "+
                " AND IF(a.fechaxAsesoria IS NULL, 1=1, a.fechaxAsesoria >= CURDATE()) AND numeroEstadoxx!=3 ",[codigo],(error,result)=>{
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
    else{
        search="codigoDocentex";
        connection.query("SELECT codigoDocentex FROM tbl_docentex WHERE emailxUsuariox = ?",[emailxUsuariox],(error,result)=>{
            if(error){
                estado['message']=error;
                res.status(500).send(estado);
            }else{
                codigo = result[0].codigoDocentex;
                connection.query("SELECT a.codigoAsesoria, a.codigoDocentex, a.codigoEstudnte,\
                a.fechaxAsesoria, a.horaxxInicioxx, a.horaxxFinalxxx,\
                a.codigoGoogleID, a.numeroEstadoxx, estadoNotifica,\
                IF(a.numeroEstadoxx = 4, \
                    CONCAT('Cambio/Cancelacion: ',a.descriCambioxx,'.<br>',a.descriAsesoria),\
                    a.descriAsesoria) descriAsesoria,\
                DATE_FORMAT(fechaxAsesoria,'%Y/%m/%d') as fecha,\
                CASE \
                    WHEN a.numeroEstadoxx = 1 THEN 'En Proceso'\
                    WHEN a.numeroEstadoxx = 4 THEN 'Peticion cambio/cancelacion'\
                    ELSE 'Agendado'\
                END as estado,\
                CONCAT(b.nombreEstudnte,' ', b.apelliEstudnte) as nombreEstudnte, "
                +" b.emailxUsuariox as emailxEstudnte"
                +" FROM tbl_asesoria a LEFT JOIN tbl_estudnte b ON a.codigoEstudnte = b.codigoEstudnte "
                +" WHERE "+search+" = ? "+
                " AND IF(a.fechaxAsesoria IS NULL, 1=1, a.fechaxAsesoria >= CURDATE()) AND numeroEstadoxx!=3 ",[codigo],(error,result)=>{
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
                " codigoGoogleID = ?, descriCambioxx = NULL "+
                " WHERE codigoAsesoria = ?",
                [fechaxAsesoria,horaxInicioxx,horaxFinalxxx,codigoGoogleID, codigoAsesoria],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        connection.query("ROLLBACK",(error,result)=>{});
                        res.status(500).send(estado);
                    }
                    else{
                        connection.query("SELECT codigoEstudnte FROM tbl_asesoria WHERE codigoAsesoria = ?",[codigoAsesoria],(error,valor)=>{
                            if(valor){
                                const codigoEstudnte = valor[0]['codigoEstudnte'];
                                const tbl_histnoti = [codigoEstudnte,'Asesoria modificada','El Docente ha modificado la fecha de la asesoría','meet'];
                                connection.query("INSERT INTO tbl_histnoti(codigoUsuariox, nombreNotifica, descriNotifica, tipoxxNotifica, fechaxCreacion) VALUES (?,NOW())",[tbl_histnoti]);
                            }
                        })
                        
                        estado['estado']=true;
                        connection.query("COMMIT",(error,result)=>{});
                        estado['message']="Datos Registrados Correctamente";  
                        notifyAsesorias(codigoAsesoria,2);
                        res.status(200).send(estado);
                    }
                });      
        }
    });
    connection.end;
    console.log("entra Asesoria");
});

router.post('/change',(req,res)=>{
    console.log("Entra change");
    const emailxUsuariox = req.body.emailxUsuariox;
    const descriCambcanc = req.body.descriCambcanc;
    const codigoAsesoria = req.body.codigoAsesoria;

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
                " numeroEstadoxx = 4, descriCambioxx = ? "+
                " WHERE codigoAsesoria = ?",
                [descriCambcanc, codigoAsesoria],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        connection.query("ROLLBACK",(error,result)=>{});
                        res.status(500).send(estado);
                    }
                    else{
                        connection.query("SELECT codigoDocentex FROM tbl_asesoria WHERE codigoAsesoria = ?",[codigoAsesoria],(error,valor)=>{
                            if(valor){
                                const codigoDocentex = valor[0]['codigoDocentex'];
                                const tbl_histnoti = [codigoDocentex,'Asesoria modificada','El Estudiante ha solicitado cambio de fecha o cancelación de la asesoría','meet'];
                                connection.query("INSERT INTO tbl_histnoti(codigoUsuariox, nombreNotifica, descriNotifica, tipoxxNotifica, fechaxCreacion) VALUES (?,NOW())",[tbl_histnoti]);
                            }
                        })
                        
                        estado['estado']=true;
                        connection.query("COMMIT",(error,result)=>{});
                        estado['message']="Datos Registrados Correctamente";  
                        notifyAsesorias(codigoAsesoria,4);
                        res.status(200).send(estado);
                    }
                });      
        }
    });
    connection.end;
});

//Cancelar asesoria del lado del asesor/docente
router.post('/deleteAsesoria',(req,res)=>{
    
    const {codigoAsesoria} = req.body; 

    let estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    let connection = mysqlConnection;
    
    connection.query("START TRANSACTION",(error,result)=>{
        if(error){
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }else{
            //console.log("aqui");
            connection.query(
                "UPDATE tbl_asesoria SET"+
                " numeroEstadoxx = 3,  "+
                " WHERE codigoAsesoria = ?",
                [codigoAsesoria],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        connection.query("ROLLBACK");
                        res.status(500).send(estado);
                    }
                    else{                        
                        estado['estado']=true;
                        connection.query("COMMIT");
                        estado['message']="Datos Registrados Correctamente";  
                        notifyAsesorias(codigoAsesoria,3);
                        res.status(200).send(estado);
                    }
                });      
        }
    });
    connection.end;
});

//Cancelar asesoria del lado del estudiante
router.delete('/deleteAsesoria',(req,res)=>{
    const {codigoAsesoria} = req.body; 

    let estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    let connection = mysqlConnection;
    connection.query("START TRANSACTION");
    connection.query("DELETE FROM tbl_asesoria WHERE codigoAsesoria=? ",[codigoAsesoria],(error,result)=>{
        if(error){
            estado['message']="Error al eliminar la asesoria";
            console.log(error);
            connection.query("ROLLBACK");
            res.status(200).send(estado);
        }
        else if(result){
            estado['message']="Asesoría eliminada correctamente";
            estado['estado']=true;
           // console.log(result);
            connection.query("COMMIT");
            res.status(200).send(estado);
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