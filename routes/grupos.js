const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');


router.post("/registerGroup",(req,res)=>{
    let connection = mysqlConnection;
    let {nombreGrupoxxx,
        docentes, emailxUsuariox,
        codigoEtapaxxx} = req.body;
    
    const insert = [codigoEtapaxxx,nombreGrupoxxx, emailxUsuariox];
    console.log(insert);
    var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("INSERT INTO tbl_grupoxxx( "+
            "codigoEtapaxxx, nombreGrupoxxx, usuariCreacion"+
            "fechaxCreacion) VALUES ("+
            "?,NOW())",[insert],(error,result)=>{
        if(error){
            console.log(error);
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }else{
            console.log(result.insertId);
            for(let docente of docentes){
                let grupodoc = [result.insertId, docente.value];
                connection.query("INSERT INTO tbl_grupdocn(codigoGrupoxxx,codigoDocentex)VALUE(?)",[grupodoc]);
            }
            estado['message']='El Registro se realizó correctamente';
            estado['estado']=true;
            connection.query("COMMIT");
            console.log(estado);
            res.status(200).send(estado);
        }
    });
    connection.end; 
});

router.put("/updateGroup",(req,res)=>{
    let connection = mysqlConnection;
    let {nombreGrupoxxx,
        docentes, codigoGrupoxxx,
        codigoEtapaxxx} = req.body;
    
    const insert = [codigoEtapaxxx,nombreGrupoxxx];
    console.log(insert);
    var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("UPDATE tbl_grupoxxx SET codigoEtapaxxx=?, "+
            "nombreGrupoxxx= ?, "+
            "fechaxCreacion= NOW() "+
            " WHERE codigoGrupoxxx = ?",[codigoEtapaxxx,nombreGrupoxxx,codigoGrupoxxx],(error,result)=>{
        if(error){
            console.log(error);
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }else{
            connection.query("DELETE FROM tbl_grupdocn WHERE codigoGrupoxxx = ?",[codigoGrupoxxx]);
            for(let docente of docentes){
                let grupodoc = [codigoGrupoxxx, docente.value];
                connection.query("INSERT INTO tbl_grupdocn(codigoGrupoxxx,codigoDocentex)VALUE(?)",[grupodoc]);
            }
            estado['message']='El Grupo se actualizó correctamente';
            estado['estado']=true;
            connection.query("COMMIT");
            console.log(estado);
            res.status(200).send(estado);
        }
    });
    connection.end; 
});

router.get("/getTeachbyteam", (req,res)=>{
    let connection = mysqlConnection;
    let {codigoGrupoxxx} = req.query;
    let query = "SELECT b.codigoDocentex as value, CONCAT(b.nombreDocentex,' ',b.apelliDocentex) as label \
     FROM tbl_grupdocn a, tbl_docentex b WHERE a.codigoDocentex=b.codigoDocentex AND a.codigoGrupoxxx = ?";
    connection.query(query,[codigoGrupoxxx],(err,result)=>{
        console.log(query);
        if(result){
            res.status(200).send(result);
        }
    })
    connection.end; 
});

/* Traemos los grupos con nombre de los docentes del grupo */
router.get("/getKind",(req,res, )=>{ 
    let connection = mysqlConnection;
    let {codigoEtapaxxx, codigoGrupoxxx} = req.query;
    
    let conditionEtapa = !codigoEtapaxxx ? " ":" AND b.codigoEtapaxxx = '"+codigoEtapaxxx+"' ";
    let conditionGrupo = !codigoGrupoxxx ? " ":" AND b.codigoGrupoxxx = '"+codigoGrupoxxx+"' ";
    let query ="SELECT b.codigoGrupoxxx, COUNT(DISTINCT a.codigoEstudnte) as cantidad, UPPER(b.nombreGrupoxxx) as nombreGrupoxxx,  \
	TRIM(GROUP_CONCAT(DISTINCT COALESCE(CONCAT(' ',d.nombreDocentex,' ',d.apelliDocentex), d.nombreDocentex))) as docentes, \
    b.codigoEtapaxxx \
    FROM tbl_grupoxxx b \
    LEFT JOIN tbl_grupstud a ON a.codigoGrupoxxx=b.codigoGrupoxxx \
    LEFT JOIN tbl_grupdocn c ON b.codigoGrupoxxx = c.codigoGrupoxxx \
    LEFT JOIN tbl_docentex d ON c.codigoDocentex=d.codigoDocentex \
    WHERE b.numeroEstadoxx=1 "+conditionEtapa+" \
    "+conditionGrupo+" \
    GROUP BY b.codigoGrupoxxx" ;
    connection.query(query,[codigoEtapaxxx],(error,result)=>{
        if(error){
            console.log(error);
            res.status(500).send(error);
        }
        if(result){
            res.status(200).send(result);
        }
    });
    connection.end; 
});



router.delete("/dropGroup",(req,res)=>{
    let connection = mysqlConnection;
    let {codigoGrupoxxx, emailxUsuariox} = req.query;

    let estado = [{"estado":false, "message":"No se pudo Realizar la eliminación"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("DELETE FROM tbl_grupstud WHERE codigoGrupoxxx = ?",[codigoGrupoxxx]);
    connection.query("DELETE FROM tbl_grupdocn WHERE codigoGrupoxxx = ?",[codigoGrupoxxx]);
    connection.query("UPDATE tbl_grupoxxx SET numeroEstadoxx=0 , usuariCreacion = ? \
     WHERE codigoGrupoxxx = ?",[emailxUsuariox,codigoGrupoxxx],(error,result)=>{
        if(error){
            console.log(error);
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }else{
            estado['message']='El Grupo se eliminó correctamente';
            estado['estado']=true;
            connection.query("COMMIT");
            console.log(estado);
            res.status(200).send(estado);
        }
     });

    connection.end; 
});
/*
router.get("/getKind",(req,res)=>{
    let connection = mysqlConnection;
    let {codigoEtapaxxx} = req.query;
    let conditionEtapa = !codigoEtapaxxx ? " ":"WHERE codigoEtapaxxx = '"+codigoEtapaxxx+"' ";
    let query ="SELECT codigoGrupoxxx, nombreGrupoxxx FROM tbl_grupoxxx "+
    conditionEtapa ;
    connection.query(query,[codigoEtapaxxx],(error,result)=>{
        if(error){
            console.log(error);
            res.status(500).send(error);
        }
        if(result){
           // console.log(query);
            res.status(200).send(result);
        }
    });
    connection.end; 
});*/

//Aqui obtengo los estudiantes que no tienen grupo
router.get("/getGroups",(req,res)=>{
    let connection = mysqlConnection;
    //console.log(req.query);
    let {codigoEtapaxxx,codigoGrupoxxx,emailxUsuariox,codigoPerfilxx} = req.query;
    let conditionadmin = codigoPerfilxx==1 ? " ": " AND e.emailxUsuariox = '"+emailxUsuariox+"' ";
    let conditionGroup = !codigoGrupoxxx ? " ": " AND a.codigoGroupxxx = '"+codigoGrupoxxx+"' ";

    let query = "SELECT a.nombreGrupoxxx,a.codigoEtapaxxx,c.nombreEstudnte,c.apelliEstudnte,c.emailxUsuariox,d.nombreProyecto,b.codigoGrupstud,a.codigoGrupoxxx "+
    " FROM tbl_grupoxxx a LEFT JOIN tbl_grupstud b ON a.codigoGrupoxxx = b.codigoGrupoxxx "+
    " LEFT JOIN tbl_estudnte c ON b.codigoEstudnte = c.codigoEstudnte "+
    " LEFT JOIN tbl_proyecto d ON c.codigoEstudnte = d.codigoEstudnte "+
    //" LEFT JOIN tbl_docentex e ON a.codigoDocentex = e.codigoDocentex "+
    " WHERE d.codigoProystat != 4 AND a.codigoEtapaxxx = ? "+ 
    conditionadmin + conditionGroup +
    " ORDER BY a.nombreGrupoxxx ";

    if(codigoPerfilxx==1 && !codigoEtapaxxx){
        query = "SELECT a.nombreEstudnte,a.apelliEstudnte,a.emailxUsuariox,b.nombreProyecto "+
    " FROM tbl_estudnte a, tbl_proyecto b "+
    " WHERE a.codigoEstudnte = b.codigoEstudnte AND b.codigoProystat != 4 AND a.codigoEstudnte NOT IN(SELECT codigoEstudnte FROM tbl_grupstud) ";
    }

    connection.query(query,[codigoEtapaxxx],(error,result)=>{
        if(error){
            console.log(error);
            res.status(500).send(error);
        }
        if(result){
           // console.log(query);
            res.status(200).send(result);
        }
    });
    connection.end; 
});

router.get("/getEstudiantes",(req,res)=>{
    let connection = mysqlConnection;
    
    let {codigoGrupoxxx} = req.query;
    connection.query(
        "SELECT a.codigoProyecto,a.nombreProyecto, a.descriProyecto, CONCAT(b.nombreEstudnte,' ',b.apelliEstudnte) as nombreEstudnte, \
            b.emailxUsuariox as emailxEstudnte, c.codigoGrupstud,\
            (SELECT COUNT(1) FROM tbl_tareaxxx WHERE codigoProyecto=a.codigoProyecto AND codigoEtapaxxx=a.codigoEtapaxxx AND numeroEstadoxx!=0) as totalxTareaxxx, \
            (SELECT COUNT(1) FROM tbl_tareaxxx WHERE codigoProyecto=a.codigoProyecto AND codigoEtapaxxx=a.codigoEtapaxxx AND numeroEstadoxx=3 ) as tareaxEjecutad \
         FROM tbl_proyecto a, tbl_estudnte b, tbl_grupstud c WHERE a.codigoEstudnte=b.codigoEstudnte \
         AND a.codigoEstudnte = c.codigoEstudnte \
         AND c.codigoGrupoxxx = ?",[codigoGrupoxxx],
         (error,result)=>{
            if(error){
                console.log(error);
                res.status(500).send(error);
            }
            if(result){
                res.status(200).send(result);
            }
         });
    connection.end;  
})

router.delete("/deleteItem/:codigoGrupstud",(req,res)=>{
    let connection = mysqlConnection;
    let codigoGrupstud = req.params.codigoGrupstud;
    console.log(codigoGrupstud);
    let estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("DELETE FROM tbl_grupstud WHERE codigoGrupstud=?",[codigoGrupstud],(error,result)=>{
        if(error){
            estado['message']="Error al eliminar al estudiante del grupo";
            console.log(error);
            connection.query("ROLLBACK");
            res.status(500).send(estado);
        }
        else if(result){
            estado['message']="Se retiró el estudiante del grupo exitosamente";
            estado['estado']=true;
            console.log(result);
            connection.query("COMMIT");
            res.status(200).send(estado);
        }
    });
    connection.end; 
});

router.put("/updateItem/:codigoGrupstud",(req,res)=>{
    let connection = mysqlConnection;
    let codigoGrupstud = req.params.codigoGrupstud;
    let codigoGrupoxxx = req.body.codigoGrupoxxx;
    let emailxUsuariox = req.body.emailxEstudnte;

    console.log(req.params);
    console.log(req.body);
    let estado = [{"estado":false, "message":"No se pudo Realizar la actualización"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    if(codigoGrupstud!=="undefined"){
        connection.query("UPDATE tbl_grupstud SET codigoGrupoxxx=?"+
                        "WHERE codigoGrupstud=? ",[codigoGrupoxxx,codigoGrupstud],(error,result)=>{
            if(error){
                estado['message']="Error al cambiar el estudiante de Grupo";
                console.log(error);
                connection.query("ROLLBACK");
                res.status(500).send(estado);
            }
            else if(result){
                console.log("sin");
                estado['message']="El cambio se realizó exitosamente";
                estado['estado']=true;
                console.log(result);
                connection.query("COMMIT");
                res.status(200).send(estado);
            }
        });
    }else{
        connection.query("SELECT codigoEstudnte FROM tbl_estudnte WHERE emailxUsuariox=?",[emailxUsuariox],(error,result)=>{
            if(result){
                connection.query("INSERT INTO tbl_grupstud (codigoGrupoxxx,codigoEstudnte) VALUES(?,?)",[codigoGrupoxxx,result[0]['codigoEstudnte']]
                ,(e,r)=>{
                    if(e){
                        estado['message']="Error al cambiar el estudiante de Grupo";
                        console.log(e);
                        connection.query("ROLLBACK");
                        res.status(500).send(estado);
                    }
                    else if(r){
                        console.log("sin");
                        estado['message']="El cambio se realizó exitosamente";
                        estado['estado']=true;
                        console.log(r);
                        connection.query("COMMIT");
                        res.status(200).send(estado);
                    }
                })
            }
        })
    }
    connection.end; 
    console.log("llega"); 
});

/*
para verificar el token lo mandamos en el tercer parametro de la consulta que se haga
ejemplo: router.get('/:emailxUsuariox/proyecto',verifytoken,(req,res)=>{}) se manda por 
beaser token en postman 
*/
 
module.exports = router; 