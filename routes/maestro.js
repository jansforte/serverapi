const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');

//Maestro Categorias-----------------------------------------------------------------------------------------
router.get("/getCategory",(req,res)=>{
  const connection = mysqlConnection;
  connection.query("SELECT codigoCategori, UPPER(nombreCategori) as nombreCategori \
    FROM tbl_categori WHERE numeroEstadoxx = 1",
   (error,results)=>{
    if(error){
      res.status(200).send("Error al conectar con la base de datos");
    }
    else{
      res.status(200).send(results);
    }
  });
  connection.end;
});

router.get("/getCategoryFilter",(req,res)=>{
  const codigoCategori = req.query.id;
  const numeroEstadoxx = req.query.estado;
  const nombreCategori = req.query.nombre ? decodeURI(req.query.nombre) : '';
  let consulta = '';
  consulta += codigoCategori ? ` AND codigoCategori ='${codigoCategori}' ` : '';
  consulta += numeroEstadoxx ? ` AND numeroEstadoxx ='${numeroEstadoxx}' ` : '';
  consulta += nombreCategori ? ` AND nombreCategori LIKE'%${nombreCategori}%' ` : '';

  const connection = mysqlConnection;
  connection.query("SELECT codigoCategori, UPPER(nombreCategori) as nombreCategori, \
   IF(numeroEstadoxx = 1, 'ACTIVO', 'INACTIVO') as numeroEstadoxx FROM tbl_categori \
   WHERE 1=1 "+consulta,
   (error,results)=>{
    if(error){
      res.status(200).send("Error al conectar con la base de datos");
    }
    else{
      res.status(200).send(results);
    }
  });
  connection.end;
});

router.post("/registerCategory",(req,res)=>{

   const connection = mysqlConnection;
   const {nombreCategori, numeroEstadoxx, emailxUsuariox} = req.body;
   const insert = [nombreCategori,numeroEstadoxx,emailxUsuariox];
   let estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
   estado = estado[0];

   connection.query("START TRANSACTION");
   connection.query("\
   INSERT INTO `tbl_categori`(\
    `nombreCategori`, `numeroEstadoxx`, \
    `usuariCreacion`, `fechaxCreacion`\
    ) VALUES ( ? , NOW())",
    [insert], 
        (error, result)=>{
          if(error){
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(200).send(req.headers);
          }
          else{
            estado['message']='El registro se realizó correctamente';
            estado['estado']=true;
            connection.query("COMMIT");
            res.status(200).send(estado);
        }
        });
    connection.end; 
});

router.put("/updateCategory/:id",(req,res)=>{
  const connection = mysqlConnection;
  const {nombreCategori, numeroEstadoxx, emailxUsuariox} = req.body;
  const codigoCategori = req.params.id;
  let estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
  estado = estado[0];

  connection.query("START TRANSACTION");
  connection.query("\
  UPDATE `tbl_categori` SET\
   `nombreCategori` = ?, `numeroEstadoxx`= ?, \
   `usuariModifica` = ?, `fechaxModifica` = NOW()\
   WHERE codigoCategori = ?",
   [nombreCategori, numeroEstadoxx, emailxUsuariox,codigoCategori], 
       (error, result)=>{
         if(error){
           estado['message']=error;
           connection.query("ROLLBACK");
           res.status(200).send(estado);
         }
         else{
           estado['message']='La actualización se realizó correctamente';
           estado['estado']=true;
           connection.query("COMMIT");
           res.status(200).send(estado);
       }
       });
   connection.end; 
})
//Fin Maestro Categorias-----------------------------------------------------------------------------------------
module.exports = router; 