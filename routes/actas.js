const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');
const {notifyActas} = require('./notify');

const registerPost = multer();

//Lista tipo acta-----------------------------------------------------------------------------------------
router.get("/getTipoActa",(req,res)=>{
  const connection = mysqlConnection;
  connection.query("SELECT codigoTipoacta as value, UPPER(nombreTipoacta) as label FROM `tbl_tipoacta`",
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
//Fin lista tipo acta

router.get("/getActasFilter",(req,res)=>{
  const nombre = req.query.nombre;
  const modaliActaxxxx = req.query.modaliActaxxxx;
  const codigoTipoacta = req.query.codigoTipoacta;
  const order = req.query.order;

  let consulta = '';
  consulta += nombre ? ` AND (a.temaxxActaxxxx LIKE '%${nombre}%' 
                        OR a.lugarxActaxxxx LIKE '%${nombre}%' 
                        OR a.usuariCreacion LIKE '%${nombre}%' )` : '';
  consulta += modaliActaxxxx ? ` AND a.modaliActaxxxx ='${modaliActaxxxx}' ` : '';
  consulta += codigoTipoacta ? ` AND a.codigoTipoacta ='${codigoTipoacta}' ` : '';
  let orden = order == 1 ? `ASC` : 'DESC';

  const connection = mysqlConnection;
  connection.query(
  "SELECT a.codigoActaxxxx, UPPER(a.temaxxActaxxxx) temaxxActaxxxx, UPPER(b.nombreTipoacta) nombreTipoacta,\
   IF(a.modaliActaxxxx = 1, 'PRESENCIAL', 'VIRTUAL') modaliActaxxxx, UPPER(a.lugarxActaxxxx) lugarxActaxxxx,\
   CONCAT(a.fechaxActaxxxx , ' (', a.horaxxInicioxx ,' - ', a.horaxxFinxxxxx,')') fechaxActaxxxx,\
   UPPER(COALESCE(u.nombreUsuariox,a.usuariCreacion)) usuariCreacion, a.fechaxCreacion,\
   TRIM(GROUP_CONCAT(CONCAT(' ',UPPER(p.nombrePartcpnt)))) participantesx, \
   TRIM(GROUP_CONCAT(CONCAT(' ',LOWER(p.emailxPartcpnt)))) emailxParticip\
   FROM `tbl_actaxxxx` a \
        LEFT JOIN tbl_usuarios u ON a.usuariCreacion = u.emailxUsuariox \
        LEFT JOIN tbl_actapart p ON a.codigoActaxxxx = p.codigoActaxxxx,\
    tbl_tipoacta b \
    WHERE 1=1 AND a.codigoTipoacta = b.codigoTipoacta "+consulta+" GROUP BY a.codigoActaxxxx "+orden,
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

router.get("/getActa/:codigoActaxxx",(req,res)=>{
  const {codigoActaxxx} = req.params

  const connection = mysqlConnection;
  connection.query(
  "SELECT a.codigoActaxxxx, UPPER(a.temaxxActaxxxx) temaxxActaxxxx, UPPER(b.nombreTipoacta) nombreTipoacta,\
   IF(a.modaliActaxxxx = 1, 'PRESENCIAL', 'VIRTUAL') modaliActaxxxx, UPPER(a.lugarxActaxxxx) lugarxActaxxxx,\
   a.fechaxActaxxxx, a.horaxxInicioxx, a.horaxxFinxxxxx,\
   UPPER(COALESCE(u.nombreUsuariox,a.usuariCreacion)) usuariCreacion, a.fechaxCreacion\
   FROM `tbl_actaxxxx` a \
        LEFT JOIN tbl_usuarios u ON a.usuariCreacion = u.emailxUsuariox, \
    tbl_tipoacta b \
    WHERE 1=1 AND a.codigoTipoacta = b.codigoTipoacta AND a.codigoActaxxxx=?",[codigoActaxxx],
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

router.get("/getActaAgenda/:codigoActaxxx",(req,res)=>{
  const {codigoActaxxx} = req.params
  const connection = mysqlConnection;
  connection.query(
  "SELECT UPPER(a.activiActagend) activiActagend\
   FROM `tbl_actagend` a \
    WHERE 1=1 AND a.codigoActaxxxx=?",[codigoActaxxx],
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

router.get("/getActaCompromiso/:codigoActaxxx",(req,res)=>{
  const {codigoActaxxx} = req.params
  const connection = mysqlConnection;
  connection.query(
  "SELECT UPPER(a.comproActaxxxx) comproActaxxxx\
   FROM `tbl_actacomp` a \
    WHERE 1=1 AND a.codigoActaxxxx=?",[codigoActaxxx],
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

router.get("/getActaInternos/:codigoActaxxx",(req,res)=>{
  const {codigoActaxxx} = req.params
  const connection = mysqlConnection;
  connection.query(
  "SELECT UPPER(a.nombrePartcpnt) nombrePartcpnt, UPPER(a.emailxPartcpnt) emailxPartcpnt\
   FROM `tbl_actapart` a \
    WHERE 1=1 AND a.tipoxxPartcpnt='1' AND a.codigoActaxxxx=?",[codigoActaxxx],
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

router.get("/getActaExternos/:codigoActaxxx",(req,res)=>{
  const {codigoActaxxx} = req.params
  const connection = mysqlConnection;
  connection.query(
  "SELECT UPPER(a.nombrePartcpnt) nombrePartcpnt, UPPER(a.emailxPartcpnt) emailxPartcpnt,\
    UPPER(a.entidaPartcpnt) entidaPartcpnt, UPPER(a.cargoxPartcpnt) cargoxPartcpnt\
   FROM `tbl_actapart` a \
    WHERE 1=1 AND a.tipoxxPartcpnt='2' AND a.codigoActaxxxx=?",[codigoActaxxx],
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



router.post("/registerActa",registerPost.none(),(req,res)=>{

   const connection = mysqlConnection;
   const {emailxUsuariox, temaxxActaxxxx,
    codigoTipoacta, modaliActaxxxx, lugarxActaxxxx,
    fechaxActaxxxx, horaxxInicioxx, horaxxFinxxxxx,
    tamanoInternox, tamanoExternox, tamanoActivida,
    tamanoCompromx} = req.body;

   const insert = [temaxxActaxxxx,codigoTipoacta,modaliActaxxxx,lugarxActaxxxx,
    fechaxActaxxxx,horaxxInicioxx,horaxxFinxxxxx,emailxUsuariox];
   let estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
   estado = estado[0];

   connection.query("START TRANSACTION");
   connection.query("\
   INSERT INTO `tbl_actaxxxx`(\
    `temaxxActaxxxx`, `codigoTipoacta`, `modaliActaxxxx`,\
    `lugarxActaxxxx`, `fechaxActaxxxx`, `horaxxInicioxx`,\
    `horaxxFinxxxxx`, `usuariCreacion`, `fechaxCreacion`) VALUES (?,NOW())",
    [insert], 
        (error, result)=>{
          if(error){
            estado['message']=error;
            connection.query("ROLLBACK");
            res.status(200).send(error);
          }
          else{
            estado['message']='El registro se realizó correctamente';
            estado['estado']=true;
            let codigoActaxxxx = result.insertId;

            //Registrar Participantes Internos
            for(let i=0; i<tamanoInternox; i++){
              let insertInterno = [codigoActaxxxx,1,
                req.body['nombreInternox'+i],req.body['emailxInternox'+i]]
              connection.query("INSERT INTO `tbl_actapart`(\
                `codigoActaxxxx`, `tipoxxPartcpnt`, `nombrePartcpnt`,\
                `emailxPartcpnt`)\
                VALUES (?)",[insertInterno]);
            }
            //Fin participantes internos
            
            //Registrar Participantes Externos
            for(let i=0; i<tamanoExternox; i++){
              let insertExterno = [codigoActaxxxx,2,
                req.body['nombreExternox'+i],req.body['emailxExternox'+i],
                req.body['entidaExternox'+i],req.body['cargoxExternox'+i]]
              connection.query("INSERT INTO `tbl_actapart`(\
                `codigoActaxxxx`, `tipoxxPartcpnt`, `nombrePartcpnt`,\
                `emailxPartcpnt`, `entidaPartcpnt`, `cargoxPartcpnt`)\
                VALUES (?)",[insertExterno]);
            }
            //Fin participantes externos
            
            //Registrar Agenda a Desarrollar
            for(let i=0; i<tamanoActivida; i++){
              let insertAgenda = [codigoActaxxxx,req.body['activiActagend'+i]]
              connection.query("INSERT INTO `tbl_actagend`(\
                `codigoActaxxxx`, `activiActagend`)\
                VALUES (?)",[insertAgenda]);
            }
            //Fin Agenda a Desarrollar
            
            //Registrar Compromisos
            for(let i=0; i<tamanoCompromx; i++){
              let insertCompro = [codigoActaxxxx,req.body['comproActaxxxx'+i]]
              connection.query("INSERT INTO `tbl_actacomp`(\
                `codigoActaxxxx`, `comproActaxxxx`)\
                VALUES (?)",[insertCompro]);
            }
            //Fin Compromisos


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

router.post("/notificar",registerPost.any(),async (req,res)=>{

    let file = req.files;
    let respuesta = await notifyActas(req.body,file[0]);
    res.status(200).send(respuesta[0]);
})
//Fin Maestro Categorias-----------------------------------------------------------------------------------------
module.exports = router; 