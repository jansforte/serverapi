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

router.get('/:email',(req,res)=>{
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
});

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
 
/*
para verificar el token lo mandamos en el tercer parametro de la consulta que se haga
ejemplo: router.get('/:emailxUsuariox/proyecto',verifytoken,(req,res)=>{}) se manda por 
beaser token en postman 
*/   

module.exports = router;