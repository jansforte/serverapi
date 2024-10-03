const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const registerPost = multer();

router.post("/register",registerPost.none(),(req,res)=>{
  let connection = mysqlConnection;
  const {emailxUsuariox,tituloEvaluaci,
    fechaxEvaluaci, descriEvaluaci, pregunEvaluaci} = req.body;
  
  const insert = [tituloEvaluaci,fechaxEvaluaci, descriEvaluaci, pregunEvaluaci,emailxUsuariox];
  //console.log(insert);
  var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
  estado = estado[0];
  connection.query("START TRANSACTION");
  connection.query(
    "INSERT INTO `tbl_evaluaci`(\
    `tituloEvaluaci`,`fechaxEvaluaci`,`descriEvaluaci`,\
    `pregunEvaluaci`,\
    `usuariCreacion`,`fechaxCreacion`\
    )VALUES(?,NOW())",[insert],(error,result)=>{
      if(error){
          console.log(error);
          estado['message']=error;
          connection.query("ROLLBACK");
          res.status(200).send(estado);
      }else{
          
          estado['message']='El registro se realizó correctamente';
          estado['estado']=true;
          connection.query("COMMIT");
          console.log(estado);
          res.status(200).send(estado);
      }
  });
  connection.end; 
}); 

router.put("/update",registerPost.none(),(req,res)=>{
  let connection = mysqlConnection;
  
  const {emailxUsuariox,temaxxCasoxxxx, numeroEstadoxx,
    descriCasoxxxx, urlxxxCasoxxxx, codigoCasoxxxx} = req.body;
  
  let {picturCasoxxxx} = req.body;

  let valorCondicion = '`picturCasoxxxx` = "'+picturCasoxxxx+'"';
  if(!picturCasoxxxx){
    valorCondicion = '`picturCasoxxxx` = picturCasoxxxx';//CASO%20DE%20EXITO%202.jpg
  }

  //console.log(insert);
  var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
  estado = estado[0];
  connection.query("START TRANSACTION");
  connection.query(
    "UPDATE `tbl_casoexit` SET\
    `temaxxCasoxxxx` = ?, `descriCasoxxxx` = ?, \
    "+valorCondicion+", `urlxxxCasoxxxx` = ?, \
    `numeroEstadoxx` = ?, \
    `usuariModifica` = ?, `fechaxModifica` = NOW()\
    WHERE codigoCasoxxxx = ? ",
      [temaxxCasoxxxx,descriCasoxxxx,
      urlxxxCasoxxxx,numeroEstadoxx,emailxUsuariox, codigoCasoxxxx],(error,result)=>{
      if(error){
          estado['message']=error;
          connection.query("ROLLBACK");
          res.status(200).send(estado);
      }else{
          
          estado['message']='El registro se actualizó correctamente';
          estado['estado']=true;
          connection.query("COMMIT");
          res.status(200).send(estado);
      }
  });
  connection.end; 
}); 

router.get("/getEvaluacionFilter",(req,res)=>{
  const nombre = req.query.nombre;
  const order = req.query.order;

  let consulta = '';
  consulta += nombre ? ` AND (a.tituloEvaluaci LIKE '%${nombre}%' 
                        OR a.descriEvaluaci LIKE '%${nombre}%' 
                        OR a.usuariCreacion LIKE '%${nombre}%' )` : '';
  let orden = order == 1 ? `ASC` : 'DESC';

  const connection = mysqlConnection;
  connection.query(
  "SELECT a.codigoEvaluaci, UPPER(a.tituloEvaluaci) tituloEvaluaci, UPPER(a.descriEvaluaci) descriEvaluaci,\
   IF(a.numeroEstadoxx = 1, 'ACTIVO', 'INACTIVO') nombreEstadoxx, a.numeroEstadoxx,\
   UPPER(COALESCE(u.nombreUsuariox,a.usuariCreacion)) usuariCreacion, a.fechaxCreacion\
   FROM `tbl_evaluaci` a \
        LEFT JOIN tbl_usuarios u ON a.usuariCreacion = u.emailxUsuariox\
    WHERE 1=1 "+consulta+" ORDER BY fechaxCreacion "+orden,
   (error,results)=>{
    if(error){
      res.status(200).send([]);
    }
    else{
      res.status(200).send(results);
    }
  });
  connection.end;
});

//Obtenemos la evaluación para la persona
router.get("/getInfoEvaluaEst",(req,res)=>{
  const {emailxUsuariox,codigoEvaluaci} = req.query;
  const connection = mysqlConnection;

  let informacion = [{"estado":false, "data":[]}];
  informacion =informacion[0];
  connection.query(`SELECT * FROM tbl_evaluaci WHERE codigoEvaluaci = ?`,codigoEvaluaci,(error,result)=>{
    if(result[0]){

      connection.query(`SELECT * FROM tbl_evalresp WHERE codigoEvaluaci = ? `,codigoEvaluaci,
        (error,resultDos)=>{
          if(resultDos){
            
            let existe = false;
            if(resultDos[0]){
              console.log(resultDos[0]['resultEvaluaci']);
              const data = JSON.parse(resultDos[0]['resultEvaluaci']);
              // Buscamos si el estudiante ya respondió
              existe = data.find(item => item.emailxUsuariox === `${emailxUsuariox}`);
            }

            let bandera = false;
            if (existe) {
              bandera=true;
            }

            informacion['estado']=bandera;
          }

          informacion['data']=result[0];
          res.status(200).send(informacion);

        })//Fin Segunda Consulta
    }
    else{
      res.status(200).send(informacion);
    }
  });//Fin primera consulta
  
});

router.post("/setRespuesta",registerPost.none(),(req,res)=>{
  const {emailxUsuariox,codigoEvaluaci,resultEvaluaci} = req.body;
  const connection = mysqlConnection;

  //Cuando sea un insert nos aseguramos que almacenamos el json dentro de un arreglo
  let insert = [codigoEvaluaci,'['+resultEvaluaci+']'];

  let estado = [{"estado":false, "message":"No se pudo Realizar el Registro, Intenta más tarde"}];
  estado = estado[0];
  connection.query(`SELECT * FROM tbl_evalresp WHERE codigoEvaluaci = ?`,codigoEvaluaci,(error,result)=>{
    if(error){
      estado['message']=error;
      res.status(200).send(estado);
    }
    else if(result[0]){
      
      //Convertimos el string guardado en json
      let dataResult = JSON.parse(result[0]['resultEvaluaci']);
      //convertimos el resultado string en json y lo agregamos al arreglo de bd
      dataResult.push(JSON.parse(resultEvaluaci));
      //Convertimos el arreglo en string
      dataResult = JSON.stringify(dataResult);

      connection.query("START TRANSACTION");
      connection.query(
        `UPDATE tbl_evalresp SET
          resultEvaluaci = ?
        WHERE codigoEvaluaci = ? `,[dataResult,codigoEvaluaci],(error,result)=>{
          if(error){
            connection.query("ROLLBACK");
            res.status(200).send(estado);
          }
          else{
            connection.query("COMMIT");
            estado['estado']=true;
            estado['message']="La evaluación se contestó correctamente";
            res.status(200).send(estado);
          }
      });
    }
    else if(result){
      connection.query("START TRANSACTION");
      connection.query(
        `INSERT INTO tbl_evalresp(
          codigoEvaluaci, resultEvaluaci, fechaxCreacion
        )
        VALUES( ? ,NOW())`,[insert],(error,result)=>{
          if(error){
            connection.query("ROLLBACK");
            res.status(200).send(estado);
          }
          else{
            connection.query("COMMIT");
            estado['estado']=true;
            estado['message']="La evaluación se contestó correctamente";
            res.status(200).send(estado);
          }
      });
    }
  })

});

module.exports = router; 