const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');

var DIRECTORIO = "./files/";

const storage = multer.diskStorage({
    destination: function(req,file,cb){
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
    }, 
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
});
  
const upload = multer({storage: storage});

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

const saveTarea = multer.diskStorage({
    destination: function(req,file,cb){
        if(file){
            DIRECTORIO ='./files/'+req.body.emailxEstudnte
            let Tarea = DIRECTORIO +'/tarea';
            let codigo = Tarea+'/'+req.body.codigoTareaxxx;
            if(fs.existsSync(DIRECTORIO)){
                console.log("existe");
            }else{
                fs.mkdirSync(DIRECTORIO,true);
                fs.chmod(DIRECTORIO, 0o777, (err) => {
                    if (err) throw err;
                    console.log('The permissions for file "my_file.txt" have been changed!');
                });
            }

            if(fs.existsSync(Tarea)){
                console.log("existe");
            }else{
                fs.mkdirSync(Tarea,true);
                fs.chmod(Tarea, 0o777, (err) => {
                    if (err) throw err;
                    console.log('The permissions for file "my_file.txt" have been changed!');
                });
            }
            
            if(fs.existsSync(codigo)){
                console.log("existe");
            }else{
                fs.mkdirSync(codigo,true);
                fs.chmod(codigo, 0o777, (err) => {
                    if (err) throw err;
                    console.log('The permissions for file "my_file.txt" have been changed!');
                });
            }
            cb(null,codigo);
        }
    }, 
    filename: function(req,file,cb){
        if(file){
            cb(null,file.originalname);
        }
    }
});

const archivoTarea = multer({storage: saveTarea});
/*router.get('/:email',(req,res)=>{
    var connection = mysqlConnection;
    var {email} = req.params;
    connection.query("SELECT a.* FROM tbl_proyecto a, tbl_estudnte b WHERE b.emailxUsuariox = ? AND a.codigoEstudnte = b.codigoEstudnte",[email],(error, result)=>{
            if(error)
                res.status(500).send(error);
            else
                res.status(200).send(result);
        }
    );
    connection.end;
});*/

router.get("/exist/doc/:emailxUsuariox",(req,res)=>{
    var connection = mysqlConnection;
    let {emailxUsuariox} = req.params;
    if(emailxUsuariox){
        connection.query("SELECT a.codigoProyecto FROM tbl_proyecto a "+
        " LEFT JOIN tbl_estudnte b ON a.codigoEstudnte = b.codigoEstudnte "+
        " WHERE b.emailxUsuariox = ?",[emailxUsuariox],(error,result)=>{
            if(result[0]){
                res.status(200).send(true);
            }else{
                res.status(200).send(false);        
            }
        })
    }
    else{
        res.status(200).send(false);
    }
    connection.end;
});

router.get('/list/all',(req,res)=>{
    var connection = mysqlConnection;
    var {profile} = req.query.profile;
    var codigoProystat ="'3','4'";
    profile == '2' ? codigoProystat : codigoProystat="'0'";
    connection.query(
    "SELECT a.*, CONCAT(UPPER(b.nombreEstudnte),' ',UPPER(b.apelliEstudnte)) as nombreEstudnte, UPPER(c.nombreProystat) as nombreProystat, "+
    "UPPER(d.nombreEtapaxxx) as nombreEtapaxxx, b.emailxUsuariox "+
    "FROM tbl_proyecto a LEFT JOIN tbl_proystat c ON a.codigoProystat = c.codigoProystat"+
    ", tbl_estudnte b, tbl_etapaxxx d "+
    "WHERE a.codigoProystat NOT IN("+codigoProystat+") AND a.codigoEstudnte=b.codigoEstudnte AND a.codigoEtapaxxx=d.codigoEtapaxxx "+
    "ORDER BY a.codigoProystat ASC, a.estadoNotifica DESC, a.nombreProyecto ASC",(error,result)=>{
        if(error)
        res.status(500).send(error);
        else{
            res.status(200).send(result);
        }
            
    });
    connection.end;
})
 
router.get('/list/:search',(req,res)=>{
    var connection = mysqlConnection;
    
    var {profile} = req.query.profile;
    var codigoProystat ="'3','4'";
    profile == '2' ? codigoProystat : codigoProystat="'0'";
    var {search} = req.params;
    var buscar = '%'+search+'%';
    connection.query("SELECT a.*,CONCAT(UPPER(b.nombreEstudnte),' ',UPPER(b.apelliEstudnte)) as nombreEstudnte, UPPER(c.nombreProystat) as nombreProystat, "+
    "UPPER(d.nombreEtapaxxx) as nombreEtapaxxx, b.emailxUsuariox"+
    " FROM tbl_proyecto a LEFT JOIN tbl_proystat c ON a.codigoProystat = c.codigoProystat"+
    ", tbl_estudnte b, tbl_etapaxxx d  "+
    "WHERE a.codigoProystat NOT IN("+codigoProystat+") AND a.codigoEstudnte=b.codigoEstudnte AND a.codigoEtapaxxx=d.codigoEtapaxxx "+
    "AND (a.nombreProyecto LIKE ? OR b.nombreEstudnte LIKE ? OR b.apelliEstudnte LIKE ? ) "+
    "ORDER BY a.codigoProystat ASC, a.estadoNotifica DESC, a.nombreProyecto ASC",[buscar,buscar,buscar],(error,result)=>{
        if(error)
        res.status(500).send(error);
        else
            res.status(200).send(result);
    });  
    connection.end;
}) 

router.get('/single/:search',(req,res)=>{
    var connection = mysqlConnection;
    
    var {search} = req.params;
    connection.query("SELECT a.*,CONCAT(UPPER(b.nombreEstudnte),' ',UPPER(b.apelliEstudnte)) as nombreEstudnte, UPPER(c.nombreProystat) as nombreProystat, "+
    "UPPER(d.nombreEtapaxxx) as nombreEtapaxxx, b.emailxUsuariox"+
    " FROM tbl_proyecto a LEFT JOIN tbl_proystat c ON a.codigoProystat = c.codigoProystat"+
    ", tbl_estudnte b, tbl_etapaxxx d  "+
    "WHERE a.codigoEstudnte=b.codigoEstudnte AND a.codigoEtapaxxx=d.codigoEtapaxxx "+
    "AND b.emailxUsuariox = ? "+
    "ORDER BY a.codigoProystat ASC, a.estadoNotifica DESC, a.nombreProyecto ASC",[search],(error,result)=>{
        if(error)
        res.status(500).send(error); 
        else
            res.status(200).send(result);
    });  
    connection.end;
}) 

router.post('/register',upload.single("documeProyecto"),(req,res)=>{
    console.log(req.body);
    //const {emailxUsuariox, clavexUsuariox} = req.body;
    const emailxUsuariox = req.body.emailxUsuariox;
    const nombreProyecto = req.body.nombreProyecto;
    const descriProyecto = req.body.descriProyecto;
    const nombreArchivox = req.body.nombreArchivox;
    
    let   codigoEstudnte = "";
    let   nombreEstudnte = "";

    var estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    var connection = mysqlConnection;
 
    connection.query("SELECT codigoEstudnte, nombreEstudnte, apelliEstudnte FROM tbl_estudnte WHERE emailxUsuariox = ?",[emailxUsuariox],(error,result)=>{
        if(result){
            codigoEstudnte = result[0]['codigoEstudnte'];
            nombreEstudnte = result[0]['nombreEstudnte']+' '+result[0]['apelliEstudnte'];
            const insertarProyecto =[codigoEstudnte,nombreProyecto,descriProyecto,nombreArchivox];
            connection.query("START TRANSACTION",(error,result)=>{
                if(error){
                    estado['message']=error;
                    connection.query("ROLLBACK",(error,result)=>{});
                    res.status(500).send(estado);
                }else{
                    connection.query(
                "INSERT INTO tbl_proyecto (codigoEstudnte, nombreProyecto, descriProyecto, documeProyecto, fechaxRegistro, estadoNotifica)VALUES(?,NOW(),2)",
                [insertarProyecto],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        connection.query("ROLLBACK",(error,result)=>{});
                        res.status(500).send(estado);
                    }else{
                        connection.query("SELECT codigoDocentex FROM tbl_grupoxxx WHERE codigoEstudnte = ?",[codigoEstudnte],(error,valor)=>{
                            if(valor){
                                const codigoDocentex = valor[0]['codigoDocentex'];
                                const tbl_histnoti = [codigoDocentex,'Revisión de Proyecto','El estudiante '+nombreEstudnte+' ha empezado un proyecto','proyect'];
                                connection.query("INSERT INTO tbl_histnoti(codigoUsuariox, nombreNotifica, descriNotifica, tipoxxNotifica, fechaxCreacion) VALUES (?,NOW())",[tbl_histnoti]);
                            }
                        })
                        estado['estado']=true;
                        connection.query("COMMIT",(error,result)=>{});
                        estado['message']="Proyecto Registrado Correctamente";  
                        res.status(200).send(estado);
                    }
                });            
                }
            });
        }
    })
    connection.end;
});

router.post('/update',actualizar.single("documeProyecto"),(req,res)=>{
    console.log(req.body);
    //const {emailxUsuariox, clavexUsuariox} = req.body;
    const emailxUsuariox = req.body.emailxUsuariox;
    const codigoPerfilxx = req.body.codigoPerfilxx;
    const codigoProyecto = req.body.codigoProyecto;
    var   codigoEtapaxxx = req.body.codigoEtapaxxx;
    var   codigoProystat = req.body.codigoProystat;
    const observDocentex = req.body.observDocentex;

    var estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];

    var connection = mysqlConnection;
    
    connection.query("START TRANSACTION",(error,result)=>{
        if(error){
            estado['message']=error;
            connection.query("ROLLBACK",(error,result)=>{});
            res.status(500).send(estado);
        }else{
            if(codigoPerfilxx){
                connection.query(
                    "UPDATE tbl_proyecto SET codigoEtapaxxx = ?, codigoProystat = ?, observDocentex=?, fechaxDocentex = NOW(), estadoNotifica=1"+
                    " WHERE codigoProyecto = ?",
                    [codigoEtapaxxx,codigoProystat, observDocentex, codigoProyecto],(error,result)=>{
                        if(error){
                            estado['message']=error;
                            connection.query("ROLLBACK",(error,result)=>{});
                            res.status(500).send(estado);
                        }else{
                            connection.query("SELECT codigoEstudnte FROM tbl_proyecto WHERE codigoProyecto = ?",[codigoProyecto],(error,valor)=>{
                                if(valor){
                                    const codigoEstudnte = valor[0]['codigoEstudnte'];
                                    const tbl_histnoti = [codigoEstudnte,'Revisión de Proyecto','El Docente ha revisado tu proyecto','proyect'];
                                    connection.query("INSERT INTO tbl_histnoti(codigoUsuariox, nombreNotifica, descriNotifica, tipoxxNotifica, fechaxCreacion) VALUES (?,NOW())",[tbl_histnoti]);
                                }
                            })
                            estado['estado']=true;
                            connection.query("COMMIT",(error,result)=>{});
                            estado['message']="Datos Registrados Correctamente";  
                            res.status(200).send(estado);
                        }
                    });    
            }else{
                if(codigoProystat == '3' && codigoEtapaxxx=='4') codigoProystat='4';
                if(codigoProystat == '3' && codigoEtapaxxx!='4') {
                    codigoEtapaxxx=Number(codigoEtapaxxx)+1;
                    codigoProystat=1;
                }
                console.log(codigoProystat);
                connection.query(
                    "UPDATE tbl_proyecto SET codigoEtapaxxx = ?, codigoProystat = ?, observDocentex=?, fechaxDocentex = NOW(), estadoNotifica=1"+
                    " WHERE codigoProyecto = ?",
                    [codigoEtapaxxx,codigoProystat, observDocentex, codigoProyecto],(error,result)=>{
                        if(error){
                            console.log(error);
                            estado['message']=error;
                            connection.query("ROLLBACK",(error,result)=>{});
                            res.status(500).send(estado);
                        }else{
                            connection.query("SELECT codigoEstudnte FROM tbl_proyecto WHERE codigoProyecto = ?",[codigoProyecto],(error,valor)=>{
                                if(valor){
                                    const codigoEstudnte = valor[0]['codigoEstudnte'];
                                    const tbl_histnoti = [codigoEstudnte,'Revisión de Proyecto','El Docente ha revisado tu proyecto','proyect'];
                                    connection.query("INSERT INTO tbl_histnoti(codigoUsuariox, nombreNotifica, descriNotifica, tipoxxNotifica, fechaxCreacion) VALUES (?,NOW())",[tbl_histnoti]);
                                }
                            })
                            estado['estado']=true;
                            connection.query("COMMIT",(error,result)=>{});
                            estado['message']="Datos Registrados Correctamente";  
                            res.status(200).send(estado);
                        }
                    }); 
            }         
        }
    });
    connection.end;
    console.log("entra");
});
 
router.post('/updateProyect',actualizar.single("documeProyecto"),(req,res)=>{
    console.log(req.body);
    //const {emailxUsuariox, clavexUsuariox} = req.body; 
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
            connection.query(
                "UPDATE tbl_proyecto SET estadoNotifica = 2, descriProyecto = ?, fechaxRegistro = NOW() "+
                " WHERE codigoProyecto = ?",
                [descriProyecto, codigoProyecto],(error,result)=>{
                    if(error){
                        estado['message']=error;
                        connection.query("ROLLBACK",(error,result)=>{});
                        res.status(500).send(estado);
                    }else{
                        connection.query("SELECT b.codigoDocentex, a.nombreEstudnte, a.apelliEstudnte FROM tbl_estudnte a LEFT JOIN tbl_grupoxxx b ON a.codigoEstudnte = b.codigoEstudnte WHERE a.emailxUsuariox = ?",[emailxUsuariox],(error,valor)=>{
                            if(valor){
                                const codigoDocentex = valor[0]['codigoDocentex'];
                                const nombreEstudnte = result[0]['nombreEstudnte']+' '+result[0]['apelliEstudnte'];
                                const tbl_histnoti = [codigoDocentex,'Revisión de Proyecto','El estudiante '+nombreEstudnte+' ha realizado un nuevo cambio en su proyecto','proyect'];
                                connection.query("INSERT INTO tbl_histnoti(codigoUsuariox, nombreNotifica, descriNotifica, tipoxxNotifica, fechaxCreacion) VALUES (?,NOW())",[tbl_histnoti]);
                            }
                        })
                        estado['estado']=true;
                        connection.query("COMMIT",(error,result)=>{});
                        estado['message']="Datos Registrados Correctamente";  
                        res.status(200).send(estado);
                    }
                });     
        }
    });
    connection.end;
    console.log("entra proyecto");
});

router.get('/homework/listasks/:codigoProyecto',(req,res)=>{
    const connection = mysqlConnection;
    let {codigoProyecto} = req.params;
    codigoProyecto = atob(codigoProyecto);
    connection.query("SELECT b.*, IF(b.usuariModifica IS NULL, a.nombreUsuariox,c.nombreUsuariox) as nombreUsuariox, d.nombreEstatare "+
    " FROM tbl_tareaxxx b LEFT JOIN tbl_usuarios a ON a.emailxUsuariox=b.usuariCreacion "+
    " LEFT JOIN tbl_usuarios c ON c.emailxUsuariox=b.usuariModifica "+
    " LEFT JOIN tbl_estatare d ON b.numeroEstadoxx = d.codigoEstatare " +
    " WHERE b.numeroEstadoxx!='0' AND b.codigoProyecto = ? ORDER BY b.fechaxTareaxxx DESC",
    [codigoProyecto],(error,result)=>{
        if(error){
            res.status(500).send(error); 
        }
        else{
            res.status(200).send(result);
        }
    });  
    connection.end;
});

router.post('/homework/register',(req,res)=>{
    const connection = mysqlConnection;
    console.log("entra");
    const codigoProyecto = req.body.codigoProyecto;
    const nombreTareaxxx = req.body.nombreTareaxxx;
    const descriTareaxxx = req.body.descriTareaxxx;
    const fechaxTareaxxx = req.body.fechaxTareaxxx;
    const usuariCreacion = req.body.usuariCreacion;

    let insertTareaxxx =[codigoProyecto, nombreTareaxxx,
        descriTareaxxx, fechaxTareaxxx,usuariCreacion];
        console.log(insertTareaxxx);
    let estado = [{"estado":false, "message":"Error al Registrar en la Base de Datos, intente más tarde"}];
    estado = estado[0];
    
    connection.query("START TRANSACTION");
    connection.query(
    "INSERT INTO tbl_tareaxxx(\
            codigoProyecto, nombreTareaxxx,\
            descriTareaxxx, fechaxTareaxxx, \
            usuariCreacion, fechaxCreacion) VALUES (?, NOW())",[insertTareaxxx],(error,results,fields)=>{
                console.log(fields);
                console.table(results);
                if(error){
                    estado['message']=error;
                    connection.query("ROLLBACK");
                    res.status(500).send(estado);
                }else{
                    console.log(results);
                    let codigoTareaxxx = results.insertId;
                    let observacion = "Se crea la tarea al estudiante";
                    let numeroEstadoxx = "1";
                    let archivAdjuntox = "";

                    let insertHistorial =[codigoTareaxxx,observacion,numeroEstadoxx,archivAdjuntox,usuariCreacion];
                    connection.query(
                        "INSERT INTO tbl_histarea (\
                            codigoTareaxxx, descriTareaxxx, numeroEstadoxx, \
                            archivAdjuntox, usuariCreacion, fechaxCreacion)\
                            VALUES(?,NOW())", [insertHistorial], (error, results)=>{
                                if(error){
                                    console.log(error);
                                    estado['message']="Error al insertar";
                                    banderaReg=false;
                                }
                            }
                    );
                    estado['estado']=true;
                    connection.query("COMMIT");
                    estado['message']="Tarea Registrada Correctamente";  
                    res.status(200).send(estado);
                }
            });

    connection.end;
});
 
router.put('/homework/update',(req,res)=>{
    const connection = mysqlConnection;
    console.log("entra");
    const codigoTareaxxx = req.body.codigoTareaxxx;
    const nombreTareaxxx = req.body.nombreTareaxxx;
    const descriTareaxxx = req.body.descriTareaxxx;
    const fechaxTareaxxx = req.body.fechaxTareaxxx;
    const usuariCreacion = req.body.usuariCreacion;

    let insertTareaxxx =[codigoTareaxxx, nombreTareaxxx,
        descriTareaxxx, fechaxTareaxxx,usuariCreacion];
        console.log(insertTareaxxx);
    let estado = [{"estado":false, "message":"Error al Actualizar en la Base de Datos, intente más tarde"}];
    estado = estado[0];
    
    connection.query("START TRANSACTION");
    connection.query(
    "UPDATE tbl_tareaxxx SET\
            nombreTareaxxx=?,\
            descriTareaxxx=?, fechaxTareaxxx=?, \
            usuariModifica=?, fechaxModifica=NOW() WHERE codigoTareaxxx = ? ",
            [nombreTareaxxx, descriTareaxxx, fechaxTareaxxx, usuariCreacion, codigoTareaxxx],
            (error,results,fields)=>{
                console.log(fields);
                console.table(results);
                if(error){
                    estado['message']=error;
                    console.log(error);
                    connection.query("ROLLBACK");
                    res.status(500).send(estado);
                }else{
                    estado['estado']=true;
                    connection.query("COMMIT");
                    estado['message']="Tarea Actualizada Correctamente";  
                    res.status(200).send(estado);
                }
            })
    connection.end;
});

router.put('/homework/gestion',archivoTarea.single("documeTareaxxx"),(req,res)=>{
    const connection = mysqlConnection;
    
    const codigoTareaxxx = req.body.codigoTareaxxx;
    const descriTareaxxx = req.body.descriTareaxxx;
    const numeroEstadoxx = req.body.numeroEstadoxx;
    const archivAdjuntox = req.body.archivAdjuntox;
    const usuariCreacion = req.body.usuariCreacion;

    let insertHistorial =[codigoTareaxxx,descriTareaxxx,numeroEstadoxx,archivAdjuntox,usuariCreacion];
        console.log(insertHistorial);
    let estado = [{"estado":false, "message":"Error al Actualizar en la Base de Datos, intente más tarde"}];
    estado = estado[0];
    
    let banderaReg = true;

    connection.query("START TRANSACTION");
    if(numeroEstadoxx==3){
    connection.query(
    "UPDATE tbl_tareaxxx SET\
            numeroEstadoxx=?, \
            usuariAprobado=?, fechaxAprobado=NOW() WHERE codigoTareaxxx = ? ",
            [numeroEstadoxx, usuariCreacion,codigoTareaxxx],
            (error,results)=>{
                if(error){
                    estado['message']="Error al actualizar";
                    banderaReg=false;
                }
            });
    }
    else if(numeroEstadoxx==2){
        connection.query(
        "UPDATE tbl_tareaxxx SET\
                numeroEstadoxx=?, \
                usuariGestionx=?, fechaxGestionx=NOW() WHERE codigoTareaxxx = ? ",
                [numeroEstadoxx, usuariCreacion,codigoTareaxxx],
                (error,results)=>{
                    if(error){
                        estado['message']="Error al actualizar";
                        banderaReg=false;
                    }
                });
    }
    else{
        connection.query(
            "UPDATE tbl_tareaxxx SET\
                    numeroEstadoxx=?, \
                    usuariGestionx=?, fechaxGestionx=null WHERE codigoTareaxxx = ? ",
                    [numeroEstadoxx, usuariCreacion,codigoTareaxxx],
                    (error,results)=>{
                        if(error){
                            estado['message']="Error al actualizar";
                            banderaReg=false;
                        }
                    });
    }
    connection.query(
        "INSERT INTO tbl_histarea (\
            codigoTareaxxx, descriTareaxxx, numeroEstadoxx, \
            archivAdjuntox, usuariCreacion, fechaxCreacion)\
            VALUES(?,NOW())", [insertHistorial], (error, results)=>{
                if(error){
                    estado['message']="Error al actualizar";
                    banderaReg=false;
                }
            }
    );

    if(banderaReg){
        connection.query("COMMIT");
        estado['estado']=true;
        estado['message']="Tarea Actualizada Correctamente";  
        res.status(200).send(estado);
    }
    else{
        connection.query("ROLLBACK");
        res.status(200).send(estado);
    }
    connection.end;
});

router.get('/homework/liststate/:codigoPerfilxx',(req,res)=>{
    const connection = mysqlConnection;
    let {codigoPerfilxx} = req.params;
    codigoPerfilxx = atob(codigoPerfilxx);
    let sentencia=" SELECT codigoEstatare, UPPER(nombreEstatare) nombreEstatare FROM tbl_estatare ";
    let condicion=" WHERE codigoEstatare IN(3,4) ";
    if(codigoPerfilxx==3){
        condicion=" WHERE codigoEstatare IN(1,2) ";
    }
    connection.query(sentencia+condicion,
    (error,result)=>{
        if(error)
            res.status(500).send(error); 
        else{
            res.status(200).send(result);
        }
    });  
    connection.end;
});

router.get('/homework/historial/:codigoTareaxxx',(req,res)=>{
    const connection = mysqlConnection;
    let {codigoTareaxxx} = req.params;
    codigoTareaxxx = atob(codigoTareaxxx);
    let sentencia=" SELECT a.*, b.nombreEstatare, c.nombreUsuariox FROM tbl_histarea a \
                    LEFT JOIN tbl_estatare b ON a.numeroEstadoxx = b.codigoEstatare \
                    LEFT JOIN tbl_usuarios c ON a.usuariCreacion = c.emailxUsuariox ";
    let condicion=" WHERE a.codigoTareaxxx IN("+codigoTareaxxx+") ORDER BY fechaxCreacion DESC";

    connection.query(sentencia+condicion,
    (error,result)=>{
        if(error)
            res.status(500).send(error); 
        else{
            res.status(200).send(result);
        }
    });  

    connection.end; 
});

router.delete('/homework/delete',(req,res)=>{
    const connection = mysqlConnection;
    console.log("entra");
    const codigoTareaxxx = req.body.codigoTareaxxx;
    const usuariCreacion = req.body.usuariCreacion;

    let insertHistorial =[codigoTareaxxx,usuariCreacion];
        console.log(insertHistorial);
    let estado = [{"estado":false, "message":"Error al Actualizar en la Base de Datos, intente más tarde"}];
    estado = estado[0];
    
    let banderaReg = true;

    connection.query("START TRANSACTION");

    connection.query(
    "UPDATE tbl_tareaxxx SET\
            numeroEstadoxx=0, \
            usuariModifica=?, fechaxModifica=NOW() WHERE codigoTareaxxx = ? ",
            [usuariCreacion,codigoTareaxxx],
            (error,results)=>{
                if(error){
                    estado['message']="Error al eliminar";
                    connection.query("ROLLBACK");
                    estado['estado']=false;
                    res.status(500).send(error); 
                }
                else{
                    connection.query("COMMIT");
                    estado['estado']=true;
                    estado['message']="Tarea Eliminada Correctamente";  
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