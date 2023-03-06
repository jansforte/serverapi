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

router.post("/register",changePicture.single("archivEventoxx"),(req,res)=>{
    var connection = mysqlConnection;
    console.log("entra Ofertas");
    console.log(req.body);
    var {emailxUsuariox} = req.body;
    var  nombreCursoxxx = req.body['temp.nombreCursoxxx'];
    var  mFormaCursoxxx = req.body['temp.mFormaCursoxxx'];
    var  fIInscCursoxxx = req.body['temp.fIInscCursoxxx'];
    var  fFInscCursoxxx = req.body['temp.fFInscCursoxxx'];
    var  fIAcadCursoxxx = req.body['temp.fIAcadCursoxxx'];
    var  fFAcadCursoxxx = req.body['temp.fFAcadCursoxxx'];
    var  descriCursoxxx = req.body['temp.descriCursoxxx'];
    var  cantidHorariox = req.body.cantidHorariox;
    let  horarioClases = [];
    
    let codigoCursoxxx=0;
    connection.query("SELECT IF(MAX(codigoCursoxxx) IS NULL, 1, MAX(codigoCursoxxx)+1) incremental FROM tbl_cursoxxx",(error,result)=>{
        if(result){
            codigoCursoxxx = result[0]['incremental'];
            
            const insert = [codigoCursoxxx, nombreCursoxxx,mFormaCursoxxx,fIInscCursoxxx,
                fFInscCursoxxx,fIAcadCursoxxx,fFAcadCursoxxx, descriCursoxxx, emailxUsuariox];
            
            //console.log(insert);
            var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
            estado = estado[0];
            connection.query("START TRANSACTION");
            connection.query("INSERT INTO tbl_cursoxxx("+
                    "codigoAdminxxx, codigoCursoxxx, nombreCursoxxx, mFormaCursoxxx, "+
                    "fIInscCursoxxx, fFInscCursoxxx, fIAcadCursoxxx, "+
                    "fFAcadCursoxxx, descriCursoxxx, usuariCreacion)  "+
                    "VALUES ("+
                    "1,?)",[insert],(error,result)=>{
                if(error){
                    console.log(error);
                    estado['message']=error;
                    console.log(estado);
                    connection.query("ROLLBACK");
                    res.status(500).send(estado);
                }else{
                    console.log(1);
                    console.log(result);
                    estado['message']='El Registro se realizó correctamente';
                    estado['estado']=true;

                    connection.query("COMMIT");
                    console.log(estado);
                    res.status(200).send(estado);

                    if(cantidHorariox){
        
                        for(let i=1; i<=cantidHorariox; i++){
                            let tmp = [{dia:'',ini:'',fin:''}];
                            tmp.dia = req.body['dia'+i];
                            tmp.ini = req.body['horaInHorariox'+i];
                            tmp.fin = req.body['horaFnHorariox'+i];
                            //horarioClases.push(tmp);
                            connection.query("INSERT INTO tbl_curshora("+
                            "codigoCursoxxx, diaxxxCurshora, "+
                            "horainHorariox, horafnHorariox) "+
                            "VALUES (?,?,?,?)",[codigoCursoxxx,tmp.dia,tmp.ini,tmp.fin],(error,result)=>{
                                if(error){
                                    console.log(error);
                                    estado['message']=error;
                                    connection.query("ROLLBACK");
                                }else{
                                //    console.log('a'+i);
                               //     console.log(result);
                               connection.query("COMMIT");
                                    estado['message']='Se insertó el horario correctamente';
                                    estado['estado']=true;
                                }
                            });
                        }
        
                    }

                }
            });
        
        }else{
            res.status(500).send();
        }
    });
    connection.end; 
});

var codigoPromesa=0;

router.get("/getAll",(req,res)=>{
    var connection = mysqlConnection;
    connection.query("SELECT * FROM tbl_cursoxxx ORDER BY 1 DESC",(error,result)=>{
        if(error){
            res.status(500).send(error);
        }
        if(result){
            let tmp = result;
  
            result.map((item,i)=>{
                HorarioPromesa(item.codigoCursoxxx).then((value)=>{
                   console.log("promesa"+i);
                    console.log(JSON.stringify(value));
                    tmp[i]['horarios']= JSON.parse(JSON.stringify(value));
                })
            })

            setTimeout(()=>res.status(200).send(tmp),result.length * 200);
            /*Promise.all(
                result.map((item,i)=>{
                    HorarioPromesa(item.codigoCursoxxx).then((value)=>{
                       console.log("promesa"+i);
                        console.log(JSON.stringify(value));
                    tmp[i]['horarios']= JSON.stringify(value);
                    })
                })
            ).then(
                (values)=>{console.log("a"+values); res.status(200).send(tmp)},
                (reason)=>{console.log(reason); res.status(500).send()}
            );*/
          //  setTimeout(()=>console.log(tmp),5000);
          //  res.status(200).send(result);
        }
    })
    connection.end; 
});

let HorarioPromesa = (codigoPromesa)=> new Promise((resolve,reject)=>{
    var connection = mysqlConnection; 
    var codigoCursoxxx = codigoPromesa;
    console.log("horarios");
    connection.query("SELECT codigoCursoxxx,diaxxxCurshora,horainHorariox,horafnHorariox FROM tbl_curshora WHERE codigoCursoxxx=?",[codigoCursoxxx],
    (error,result)=>{ 
        if(error){
           console.log(error);
           reject(false);
        }
        if(result){
            console.log("resu");
            console.log(result);
            resolve(result);
        }
    });
    connection.end;
});

router.get("/getHorarios/:codigoCursoxxx",(req,res)=>{
    var connection = mysqlConnection;
    var codigoCursoxxx = req.params.codigoCursoxxx;
    console.log("horarios");
    connection.query("SELECT codigoCursoxxx, diaxxxCurshora,horainHorariox,horafnHorariox FROM tbl_curshora WHERE codigoCursoxxx=?",[codigoCursoxxx],
    (error,result)=>{ 
        if(error){
            res.status(500).send(error);
        }
        if(result){
            res.status(200).send(result);
        }
    });
    connection.end;
});

router.put("/update/:codigoCursoxxx",changePicture.single("archivEventoxx"),(req,res)=>{
    var connection = mysqlConnection;
    console.log("entraUpdate");
    var codigoCursoxxx = req.params.codigoCursoxxx;
    var {emailxUsuariox, nombreCursoxxx, mFormaCursoxxx,
         fIInscCursoxxx, fFInscCursoxxx, fIAcadCursoxxx,
        fFAcadCursoxxx,  descriCursoxxx, cantidHorariox} = req.body;
    
    var estado = [{"estado":true, "message":"Los cambios se realizaron satisfactoriamente"}];
    connection.query("START TRANSACTION");
    connection.query(
        "UPDATE tbl_cursoxxx SET "+
        "nombreCursoxxx=?, mFormaCursoxxx=?, "+
        "fIInscCursoxxx=?, fFInscCursoxxx=?, "+
        "fIAcadCursoxxx=?, fFAcadCursoxxx=?,"+
        "descriCursoxxx=?"+
        "WHERE codigoCursoxxx = ? ",
        [nombreCursoxxx, mFormaCursoxxx,
        fIInscCursoxxx, fFInscCursoxxx, 
        fIAcadCursoxxx, fFAcadCursoxxx, 
        descriCursoxxx, codigoCursoxxx] 
    );

    let keys = Object.keys(req.body);
    keys.map((values)=>{
        let v = Number(values.replaceAll(/\D/g,''));
        if(v>cantidHorariox){
            cantidHorariox=v;
        }
    });

    connection.query("DELETE FROM tbl_curshora WHERE codigoCursoxxx=? ",[codigoCursoxxx]);
    for(let i = 1; i<=cantidHorariox; i++){
        if(req.body['dia'+i]){
            connection.query(
                "INSERT INTO tbl_curshora("+
                    "codigoCursoxxx, diaxxxCurshora, "+
                    "horainHorariox, horafnHorariox) "+
                    "VALUES (?,?,?,?)",
                    [codigoCursoxxx,req.body['dia'+i],
                    req.body['horaInHorariox'+i],req.body['horaFnHorariox'+i]])
        }
    }
    connection.query("COMMIT");
    res.status(200).send(estado);
    connection.end;
});

router.delete("/deleteOffer",(req,res)=>{
    var connection = mysqlConnection;
    var codigoCursoxxx = req.body.codigoCursoxxx;
    
    var estado = [{"estado":false, "message":"No se pudo Realizar el Registro"}];
    estado = estado[0];
    connection.query("START TRANSACTION");
    connection.query("DELETE FROM tbl_cursoxxx WHERE codigoCursoxxx=? ",[codigoCursoxxx],(error,result)=>{
        if(error){
            estado['message']="Error al eliminar la oferta";
            console.log(error);
            connection.query("ROLLBACK");
            res.status(200).send(estado);
        }
        else if(result){
            connection.query("DELETE FROM tbl_curshora WHERE codigoCursoxxx=? ",[codigoCursoxxx]);
            estado['message']="Oferta eliminada correctamente";
            estado['estado']=true;
           // console.log(result);
            connection.query("COMMIT");
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