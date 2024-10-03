const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');

var DIRECTORIO = "./files/";

const savePicture = multer.diskStorage({
  destination: function(req,file,cb){
    if(file){
        DIRECTORIO ='./files/casos_exito';
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
          cb(null,req.body.picturCasoxxxx)
      }
  }
});

const changePicture = multer({storage: savePicture});
router.post("/register",changePicture.single("documeCasoxxxx"),(req,res)=>{
  let connection = mysqlConnection;
  console.log(req.body);
  const {emailxUsuariox,temaxxCasoxxxx,
    descriCasoxxxx, picturCasoxxxx, urlxxxCasoxxxx} = req.body;
  
  const insert = [temaxxCasoxxxx,descriCasoxxxx,picturCasoxxxx,urlxxxCasoxxxx,1,emailxUsuariox];
  //console.log(insert);
  var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
  estado = estado[0];
  connection.query("START TRANSACTION");
  connection.query(
    "INSERT INTO `tbl_casoexit`(\
    `temaxxCasoxxxx`,`descriCasoxxxx`,`picturCasoxxxx`,\
    `urlxxxCasoxxxx`,\
    `numeroEstadoxx`,`usuariCreacion`,`fechaxCreacion`\
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

router.put("/update",changePicture.single("documeCasoxxxx"),(req,res)=>{
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

router.get("/getExitoFilter",(req,res)=>{
  const nombre = req.query.nombre;
  const modaliActaxxxx = req.query.modaliActaxxxx;
  const codigoTipoacta = req.query.codigoTipoacta;
  const order = req.query.order;

  let consulta = '';
  consulta += nombre ? ` AND (a.temaxxCasoxxxx LIKE '%${nombre}%' 
                        OR a.descriCasoxxxx LIKE '%${nombre}%' 
                        OR a.usuariCreacion LIKE '%${nombre}%' )` : '';
  let orden = order == 1 ? `ASC` : 'DESC';

  const connection = mysqlConnection;
  connection.query(
  "SELECT a.codigoCasoxxxx, UPPER(a.temaxxCasoxxxx) temaxxCasoxxxx, UPPER(a.descriCasoxxxx) descriCasoxxxx,\
   IF(a.numeroEstadoxx = 1, 'ACTIVO', 'INACTIVO') nombreEstadoxx, a.picturCasoxxxx, a.numeroEstadoxx,\
   UPPER(COALESCE(u.nombreUsuariox,a.usuariCreacion)) usuariCreacion, a.fechaxCreacion,\
   IF(a.urlxxxCasoxxxx = '', 'N/A', a.urlxxxCasoxxxx) direccUrlxxxxx, a.urlxxxCasoxxxx\
   FROM `tbl_casoexit` a \
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

module.exports = router; 