const {Router} = require('express');
const router = Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');
const {notifyActas} = require('./notify');

const registerPost = multer();
var DIRECTORIO = "./video/";

const almacen = multer.diskStorage({
    destination: function(req,file,cb){
        if(file){
            
            DIRECTORIO ='./video';
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

//Get Acerca-----------------------------------------------------------------------------------------
router.get("/getAboutUs",(req,res)=>{
  const connection = mysqlConnection;
  connection.query("SELECT resumeAcercaxx,codigoSettingx,\
  tituloPrincipa, sloganPrincipa, videoxPrincipa,\
  misionPrincipa, visionPrincipa, politiPrincipa,\
  textoxOfertaac\
   FROM `tbl_settingx` LIMIT 1",
   (error,results)=>{
    if(error){
      console.log(error);
      res.status(200).send("Error al conectar con la base de datos");
    }
    else{
      res.status(200).send(results);
    }
  });
  connection.end;
});
//Fin obtención de acerca

router.put("/setAboutUs/:id",actualizar.single("archivPrincipa"),(req,res)=>{
  const connection = mysqlConnection;
  const {
    resumeAcercaxx, tituloPrincipa, sloganPrincipa, 
    misionPrincipa, visionPrincipa, politiPrincipa,
    textoxOfertaac, docentes,
    emailxUsuariox} = req.body;
  const namexxFilexxxx = req.body.namexxFilexxxx ? req.body.namexxFilexxxx : null ;
  const codigoSettingx = req.params.id;
  
  let arrayDocentes = docentes.split("-,");

  let estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
  estado = estado[0];

  connection.query("START TRANSACTION");
  connection.query("\
  UPDATE `tbl_settingx` SET\
   `resumeAcercaxx` = ?, `tituloPrincipa` = ? , `sloganPrincipa` = ?, \
   `misionPrincipa` = ?, `visionPrincipa` = ? , `politiPrincipa` = ?, \
   `textoxOfertaac` = ?, \
   `usuariModifica` = ?, `fechaxModifica` = NOW()\
   WHERE codigoSettingx = ?",
   [resumeAcercaxx,tituloPrincipa,sloganPrincipa, misionPrincipa, visionPrincipa, politiPrincipa,
    textoxOfertaac, emailxUsuariox,codigoSettingx], 
       (error, result)=>{
         if(error){
           estado['message']=error;
           connection.query("ROLLBACK");
           res.status(200).send(estado);
         }
         else{

            if(namexxFilexxxx){
                connection.query("UPDATE `tbl_settingx` SET videoxPrincipa = ? WHERE codigoSettingx = ?",
                [namexxFilexxxx,codigoSettingx]);
            } 

            connection.query("UPDATE `tbl_docentex` SET indicaVistahom = 0");
            for(let docente of arrayDocentes){
              if(docente){
                connection.query("UPDATE `tbl_docentex` SET indicaVistahom = 1 WHERE codigoDocentex = ?",
                [docente]);
              }
            }

           estado['message']='La actualización se realizó correctamente';
           estado['estado']=true;
           connection.query("COMMIT");
           res.status(200).send(estado); 
       }
       }); 
   connection.end; 
});

//Obtenemos los docentes que se veran en el home
router.get("/getDocentes",(req,res)=>{
  const connection = mysqlConnection;

  let estado = [{"estado":false, "message":"Error al conectar con el servidor","listaDocentes":[],"listaHome":[]}];
  estado = estado[0];
  connection.query(`
  SELECT codigoDocentex as value, LOWER(CONCAT(nombreDocentex,' ',apelliDocentex)) as label, 
  LOWER(CONCAT(nombreDocentex,' ',apelliDocentex)) as nameTeach, NULL as imgProfile,
  IF(profesDocentex IS NOT NULL AND profesDocentex!='',profesDocentex,'N/A') as profetionTeach,
  indicaVistahom, b.picturUsuariox, a.emailxUsuariox
  FROM tbl_docentex a, tbl_usuarios b WHERE  a.emailxUsuariox = b.emailxUsuariox
  `,
   (error,results)=>{
    if(error){
      res.status(200).send(estado);
    }
    else{
      estado["listaDocentes"]=results;
      estado["estado"]=true;
      estado["message"]="Datos recuperados";
      for(let home of results){
        if(home["indicaVistahom"]==1){
          estado["listaHome"].push(home);
        }
      }
      res.status(200).send(estado);
    }
  });
  connection.end;
});

module.exports = router; 