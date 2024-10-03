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

const saveCertificate = multer.diskStorage({
    destination: function(req,file,cb){
        console.log(req.body);
        if(file){
            DIRECTORIO ='./files/'+req.body.emailxInscrito;
            let certificado =  DIRECTORIO+'/certificates';
            if(fs.existsSync(DIRECTORIO)){
                console.log("existe"); 
            }else{
                fs.mkdirSync(DIRECTORIO,true);
                fs.chmod(DIRECTORIO, 0o777, (err) => {
                    if (err) throw err;
                    console.log('The permissions for file "my_file.txt" have been changed!');
                });
            }

            if(fs.existsSync(certificado)){
                console.log("existe");
            }else{
                fs.mkdirSync(certificado,true);
                fs.chmod(certificado, 0o777, (err) => {
                    if (err) throw err;
                    console.log('The permissions for file "my_file.txt" have been changed!');
                });
            }

            cb(null,certificado);
        }
    },
    filename: function(req,file,cb){
        if(file){
            cb(null,"Certificate_"+req.body.codigoEventoxx+"_"+file.originalname);
        }
    }
});

const singleCertificate = multer({storage: saveCertificate});

router.post("/register",changePicture.single("archivEventoxx"),(req,res)=>{
    var connection = mysqlConnection;
    console.log("entra eventos");
    console.log(req.body);
    var {emailxUsuariox} = req.body;
    var  nombreEventoxx = req.body.nombreEventoxx;
    var  fechaxEventoxx = req.body.fechaxEventoxx;
    var  horainEventoxx = req.body.horainEventoxx;
    var  horafnEventoxx = req.body.horafnEventoxx;
    var tipoxxEventoxx = req.body.tipoxxEventoxx;
    var modaliEventoxx = req.body.modaliEventoxx;
    var linkxxReunionx = req.body.linkxxReunionx;
    var cantidAsistenc = req.body.cantidAsistenc;
    var  imagenEventoxx = req.body.nombreArchivox;
    var  descriEventoxx = req.body.descriEventoxx;
    
    const insert = [nombreEventoxx,imagenEventoxx,descriEventoxx,
                    fechaxEventoxx,horainEventoxx,horafnEventoxx, 
                    tipoxxEventoxx, modaliEventoxx, linkxxReunionx,
                    cantidAsistenc, emailxUsuariox];
    //console.log(insert);
    var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("INSERT INTO tbl_eventoxx( "+
            "codigoAdminxxx, nombreEventoxx, imagenEventoxx, "+
            "descriEventoxx, fechaxEventoxx, horainEventoxx, "+
            "horafnEventoxx, tipoxxEventoxx, modaliEventoxx, "+
            "linkxxReunionx, cantidAsistenc, usuariModifica, "+
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
    let profile = req.query.id;
    const order = req.query.ordenxFiltroxx;
    const nombre = req.query.nombreFiltroxx;
    const modaliEventoxx = req.query.modaliEventoxx;
    const tipoxxEventoxx = req.query.tipoxxEventoxx;
    const f_fechaInicial = req.query.f_fechaInicial;
    const f_fechaFinal = req.query.f_fechaFinal;
    const f_indicaCertific = req.query.f_indicaCertific;
    const emailxUsuariox = req.query.user;
    
    let consulta = '';
    consulta += nombre ? ` AND (a.nombreEventoxx LIKE '%${nombre}%' 
                        OR a.descriEventoxx LIKE '%${nombre}%' )` : '';
    consulta += modaliEventoxx ? ` AND a.modaliEventoxx = ${modaliEventoxx}` : '';
    consulta += tipoxxEventoxx ? ` AND a.tipoxxEventoxx = ${tipoxxEventoxx}` : '';
    consulta += f_fechaInicial ? ` AND a.fechaxEventoxx >= '${f_fechaInicial}'` : '';
    consulta += f_fechaFinal ? ` AND a.fechaxEventoxx <= '${f_fechaFinal}'` : '';

    let orden = order == 1 ? `ASC` : 'DESC';

    let sql="";

    if(atob(profile)==1){
        consulta += f_indicaCertific ? ` AND a.indicaCertific = ${f_indicaCertific}` : '';
        sql = `SELECT * FROM tbl_eventoxx a WHERE 1=1 ${consulta} ORDER BY a.codigoEventoxx ${orden}`
    }
    else{
        consulta += f_indicaCertific ? ` AND b.indicaCertific = ${f_indicaCertific} AND b.usuariCreacion = '${emailxUsuariox}' ` : '';
        sql = `SELECT a.*, b.indicaCertific as isCertificated, b.usuariCreacion codigoEvenasis, b.nameFileDownload
        FROM tbl_eventoxx a LEFT JOIN tbl_evenasis b ON a.codigoEventoxx = b.codigoEventoxx AND b.usuariCreacion = '${emailxUsuariox}'
         WHERE 1=1 ${consulta} ORDER BY a.codigoEventoxx ${orden}`
    } 


    connection.query(sql,(error,result)=>{
        if(error){
          //  console.log(error);
            res.status(500).send("Error de conexión, Intente más tarde");
            //res.status(200).send(sql);
        }
        if(result){
            //console.log(result);
            res.status(200).send(result);
        }
    });
    connection.end; 
});

router.get("/getEvent/:codigoEventoxx",(req,res)=>{
    let connection = mysqlConnection;
    let profile = req.query.id;
    let codigoEventoxx = req.params.codigoEventoxx;

    
    let sql = `SELECT * FROM tbl_eventoxx a WHERE codigoEventoxx=${codigoEventoxx} ORDER BY a.codigoEventoxx DESC`;

    let estado = [{"estado":false, "datos":"Error, no se pudo obtener información"}];
    estado = estado[0];

    connection.query(sql,(error,result)=>{
        if(error){
          //  console.log(error);
            res.status(500).send("Error de conexión, Intente más tarde");
            //res.status(200).send(sql);
        }
        if(result){
            //console.log(result);
            if(atob(profile)==1){
                estado["estado"]=true;
                estado["datos"]=result; 
            }
            res.status(200).send(estado);
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
            connection.query("COMMIT");
            res.status(200).send(estado);
        }
    });
    connection.end; 
});

router.put("/update/:codigoEventoxx",changePicture.single("archivEventoxx"),(req,res)=>{
    var connection = mysqlConnection;
    var codigoEventoxx = req.params.codigoEventoxx;
    var {emailxUsuariox} = req.body;
    var  nombreEventoxx = req.body.nombreEventoxx;
    var  fechaxEventoxx = req.body.fechaxEventoxx;
    var  horainEventoxx = req.body.horainEventoxx;
    var  horafnEventoxx = req.body.horafnEventoxx;
    var tipoxxEventoxx = req.body.tipoxxEventoxx;
    var modaliEventoxx = req.body.modaliEventoxx;
    var linkxxReunionx = req.body.linkxxReunionx;
    var cantidAsistenc = req.body.cantidAsistenc;
    var  imagenEventoxx = req.body.nombreArchivox;
    var  descriEventoxx = req.body.descriEventoxx;
    
    const update = [nombreEventoxx, descriEventoxx,
                    fechaxEventoxx, horainEventoxx, horafnEventoxx,
                    tipoxxEventoxx, modaliEventoxx, linkxxReunionx,
                    cantidAsistenc, emailxUsuariox, codigoEventoxx];
    const updatePic = [imagenEventoxx,codigoEventoxx];

    var estado = [{"estado":false, "message":"No se pudo Realizar la actualización"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("UPDATE tbl_eventoxx SET nombreEventoxx=?,"+
                    "descriEventoxx=?,fechaxEventoxx=?,"+
                    "horainEventoxx=?,horafnEventoxx=?,"+
                    "tipoxxEventoxx=?,modaliEventoxx=?,"+
                    "linkxxReunionx=?,cantidAsistenc=?,numeroEstadoxx=1,"+
                    "usuariModifica=?,fechaxModifica = NOW() "+
                    "WHERE codigoEventoxx=? ",[nombreEventoxx,descriEventoxx,
                        fechaxEventoxx,horainEventoxx,horafnEventoxx, tipoxxEventoxx, modaliEventoxx, linkxxReunionx,
                        cantidAsistenc, emailxUsuariox,codigoEventoxx],(error,result)=>{
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

router.post("/asistir",(req,res)=>{
    let connection = mysqlConnection;
    let estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    const {emailxUsuariox,codigoEventoxx,nombreEventoxx} = req.body;

    estado =estado[0];
    connection.query(`SELECT tipoxxEventoxx,cantidAsistenc FROM tbl_eventoxx WHERE codigoEventoxx=? AND fechaxEventoxx >= CURRENT_DATE()`,[codigoEventoxx],
    (error,result)=>{
        if(error){
            estado["message"]="Error de Conexion, Intentalo mas tarde";
            res.status(200).send(estado);
        }
        else{
            if(result[0]){
                let tipoxxEventoxx = result[0]['tipoxxEventoxx'];
                let cantidAsistenc = result[0]['cantidAsistenc'];
                //Cuando es un tipo de evento público no se toma en cuenta la cantidad
                if(tipoxxEventoxx==1){
                    connection.query(`
                    SELECT a.codigoEstudnte as codigoDocument FROM tbl_estudnte a 
                    WHERE a.emailxUsuariox='${emailxUsuariox}' 
                    UNION 
                    SELECT a.codigoDocentex as codigoDocument FROM tbl_docentex a 
                    WHERE a.emailxUsuariox='${emailxUsuariox}'
                    `,(error,result)=>{
                        if(error){
                            estado["message"]="Error de Conexion, Intentalo mas tarde";
                            res.status(200).send(estado);
                        }
                        else{
                            if(!result){
                                estado["message"]="No se pudo encontrar información del Usuario";
                                res.status(200).send(estado); 
                            }
                            else{
                                let codigoDocument = result[0].codigoDocument;
                                connection.query(`
                                SELECT 1 FROM tbl_evenasis WHERE codigoDocument = ? AND codigoEventoxx = ?
                                `,[codigoDocument,codigoEventoxx],(error,result)=>{
                                    if(error){
                                        estado["message"]="Error de Conexion, Intentalo mas tarde";
                                        res.status(200).send(estado);
                                    }
                                    else{
                                        if(result[0]){
                                            estado["message"]="El usuario ya se encuentra inscrito al Evento "+nombreEventoxx;
                                            estado["estado"]=false;
                                            res.status(200).send(estado);  
                                        }
                                        else{
                                            let insert = [codigoEventoxx,codigoDocument,emailxUsuariox];
                                            connection.query(`
                                            INSERT INTO tbl_evenasis(
                                                codigoEventoxx, codigoDocument, 
                                                usuariCreacion, fechaxCreacion) 
                                                VALUES (?,NOW())
                                            `,[insert],(error,result)=>{
                                                if(error){
                                                    estado["estado"]=false;
                                                    estado["message"]="Error de Conexion, Intentalo mas tarde";
                                                    res.status(200).send(estado);
                                                }
                                                else{
                                                    estado["estado"]=true;
                                                    estado["message"]="Su inscripción al evento "+nombreEventoxx+" se realizó exitosamente";
                                                    res.status(200).send(estado);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                //Cuando es un tipo de evento privado se toma en cuenta la cantidad inscritos
                else{
                    connection.query(`SELECT COUNT(1) as cantidad FROM tbl_evenasis WHERE codigoEventoxx=?`,[codigoEventoxx],
                    (error,result)=>{
                        if(error){
                            estado["message"]="Error de Conexion, Intentalo mas tarde";
                            res.status(200).send(estado);
                        }
                        else{
                            let cantidInscritos = result[0]['cantidad'];
                            if(cantidInscritos < cantidAsistenc){
                                connection.query(`
                                SELECT a.codigoEstudnte as codigoDocument FROM tbl_estudnte a 
                                WHERE a.emailxUsuariox='${emailxUsuariox}' 
                                UNION 
                                SELECT a.codigoDocentex as codigoDocument FROM tbl_docentex a 
                                WHERE a.emailxUsuariox='${emailxUsuariox}'
                                `,(error,result)=>{
                                    if(error){
                                        estado["message"]="Error de Conexion, Intentalo mas tarde";
                                        res.status(200).send(estado);
                                    }
                                    else{
                                        if(!result){
                                            estado["message"]="No se pudo encontrar información del Usuario";
                                            res.status(200).send(estado); 
                                        }
                                        else{
                                            let codigoDocument = result[0].codigoDocument;
                                            connection.query(`
                                            SELECT 1 FROM tbl_evenasis WHERE codigoDocument = ? AND codigoEventoxx = ?
                                            `,[codigoDocument,codigoEventoxx],(error,result)=>{
                                                if(error){
                                                    estado["message"]="Error de Conexion, Intentalo mas tarde";
                                                    res.status(200).send(estado);
                                                }
                                                else{
                                                    if(result[0]){
                                                        estado["message"]="El usuario ya se encuentra inscrito al Evento "+nombreEventoxx;
                                                        res.status(200).send(estado); 
                                                    }
                                                    else{
                                                        let insert = [codigoEventoxx,codigoDocument,emailxUsuariox];
                                                        connection.query(`
                                                        INSERT INTO tbl_evenasis(
                                                            codigoEventoxx, codigoDocument, 
                                                            usuariCreacion, fechaxCreacion) 
                                                            VALUES (?,NOW())
                                                        `,[insert],(error,result)=>{
                                                            if(error){
                                                                estado["message"]="Error de Conexion, Intentalo mas tarde";
                                                                res.status(200).send(estado);
                                                            }
                                                            else{
                                                                estado["estado"]=true;
                                                                estado["message"]="Su inscripción al evento "+nombreEventoxx+" se realizó exitosamente";
                                                                res.status(200).send(estado);
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else{
                                estado["message"]="El límite de inscritos ya se alcanzó";
                                res.status(200).send(estado);
                            }
                        }
                    })
                }
            }
            else{
                estado["message"]="No te puedes inscribir a este evento dado que el evento "+nombreEventoxx+" ya se realizó";
                res.status(200).send(estado);
            }
        }
    });
    

    connection.end; 
});

router.get("/getAttend/:codigoEventoxx",(req,res)=>{
    let connection = mysqlConnection;
    let codigoEventoxx = req.params.codigoEventoxx;
    let estado = [{"estado":false, "message":"Error de Conexion"}];
    estado =estado[0];

    connection.query(`
    SELECT a.codigoDocument as Documento, COALESCE(CONCAT(b.nombreEstudnte,' ', b.apelliEstudnte),'N/A') as Nombre,
    a.usuariCreacion as Email, IF(a.indicaAsistenc != 0,'SI','NO') as Asistencia, IF(a.indicaCertific != 0,'SI','NO') as Certificado
    FROM tbl_evenasis a, tbl_estudnte b WHERE a.codigoEventoxx = ? AND a.codigoDocument = b.codigoEstudnte
    UNION 
    SELECT a.codigoDocument as Documento, COALESCE(CONCAT(b.nombreDocentex,' ', b.apelliDocentex),'N/A') as Nombre,
    a.usuariCreacion as Email, IF(a.indicaAsistenc != 0,'SI','NO') as Asistencia, IF(a.indicaCertific != 0,'SI','NO') as Certificado
    FROM tbl_evenasis a, tbl_docentex b WHERE a.codigoEventoxx = ? AND a.codigoDocument = b.codigoDocentex
    `,[codigoEventoxx,codigoEventoxx],(error,result)=>{
        if(error){
            estado["message"]="Error de Conexion, Intentalo mas tarde";
            res.status(200).send(estado);
        }
        else{
            estado["datos"]=result;
            estado["estado"]=true;
            res.status(200).send(estado);
        }
    });
    connection.end; 
});

router.post("/setAttend",changePicture.none(),(req,res)=>{
    let connection = mysqlConnection;
    const {codigoEventoxx, emailxUsuariox,
        tamanoAsistent} = req.body;

    let estado = [{"estado":false, "message":"No se pudo Realizar el registro"}];
    estado = estado[0];

    
    for(let i=0; i<tamanoAsistent; i++){
        let codigoDocument = req.body["codigoDocument"+i];
        connection.query(`
            UPDATE tbl_evenasis SET indicaAsistenc = 1, usuariModifica = ?, fechaxModifica = NOW()
            WHERE codigoEventoxx= ? AND codigoDocument = ? 
            `,[emailxUsuariox,codigoEventoxx, codigoDocument]);   
    }

    
    estado['estado']=true;
    estado['message']="La información se registró exitosamente";
    res.status(200).send(estado);
    

    connection.end; 
});

router.post("/setSingleCertificate",singleCertificate.single("archivAdjuntox"),(req,res)=>{
    let connection = mysqlConnection;
    const {codigoEventoxx, emailxUsuariox,
           codigoDocument,namexxFilexxxx} = req.body;

    let estado = [{"estado":false, "message":"No se pudo Realizar el registro"}];
    estado = estado[0];

    
    connection.query(`
    UPDATE tbl_evenasis SET indicaCertific = 1, nameFileDownload= ?, usuariModifica = ?, fechaxModifica = NOW()
    WHERE codigoEventoxx= ? AND codigoDocument = ? 
    `,[namexxFilexxxx,emailxUsuariox,codigoEventoxx, codigoDocument]);   
   
    connection.query(`
    UPDATE tbl_eventoxx SET indicaCertific = 1
    WHERE codigoEventoxx= ? 
    `,[emailxUsuariox,codigoEventoxx]);   
    
    estado['estado']=true;
    estado['message']="La información se registró exitosamente";
    res.status(200).send(req.body);
    

    connection.end; 
});

/*
para verificar el token lo mandamos en el tercer parametro de la consulta que se haga
ejemplo: router.get('/:emailxUsuariox/proyecto',verifytoken,(req,res)=>{}) se manda por 
beaser token en postman 
*/
 
module.exports = router; 