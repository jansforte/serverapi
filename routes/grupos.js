const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');


router.post("/registerGroup",(req,res)=>{
    let connection = mysqlConnection;
    let {nombreGrupoxxx,
        docentes,
        codigoEtapaxxx} = req.body;
    
    const insert = [codigoEtapaxxx,nombreGrupoxxx];
    console.log(insert);
    var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("INSERT INTO tbl_grupoxxx( "+
            "codigoEtapaxxx, nombreGrupoxxx, "+
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

/* Traemos los grupos con nombre de los docentes del grupo */
router.get("/getKind",(req,res, )=>{
    let connection = mysqlConnection;
    let {codigoEtapaxxx} = req.query;
    let conditionEtapa = !codigoEtapaxxx ? " ":" AND b.codigoEtapaxxx = '"+codigoEtapaxxx+"' ";
    let query ="SELECT b.codigoGrupoxxx, COUNT(DISTINCT a.codigoEstudnte) as cantidad, UPPER(b.nombreGrupoxxx) as nombreGrupoxxx,  \
	TRIM(GROUP_CONCAT(DISTINCT COALESCE(CONCAT(' ',d.nombreDocentex,' ',d.apelliDocentex), d.nombreDocentex))) as docentes, \
    b.codigoEtapaxxx \
    FROM tbl_grupoxxx b \
    LEFT JOIN tbl_grupstud a ON a.codigoGrupoxxx=b.codigoGrupoxxx \
    LEFT JOIN tbl_grupdocn c ON b.codigoGrupoxxx = c.codigoGrupoxxx \
    LEFT JOIN tbl_docentex d ON c.codigoDocentex=d.codigoDocentex \
    WHERE b.numeroEstadoxx=1 "+conditionEtapa+" \
    GROUP BY b.codigoGrupoxxx" ;
    connection.query(query,[codigoEtapaxxx],(error,result)=>{
        if(error){
            console.log(error);
            res.status(500).send(error);
        }
        if(result){
            console.log(query);
            res.status(200).send(result);
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