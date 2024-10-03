const {Router} = require('express');
const router = Router();
const crypto = require('crypto');
const {transporter, mailOptions} = require('../datamail');
const mysqlConnection = require('../database');
const multer = require('multer');
const fs = require('fs');

const generarString = (longitud) => {
  let result = "";
  const abc = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" "); // Espacios para convertir cara letra a un elemento de un array
  for(i=1;i<=longitud;i++) {
    if (abc[i]) { // Condicional para prevenir errores en caso de que longitud sea mayor a 26
      const random = Math.floor(Math.random() * 4); // Generaremos el número
      const random2 = Math.floor(Math.random() * abc.length); // Generaremos el número
      const random3 = Math.floor(Math.random() * abc.length + 3); // Generaremos el número
      if (random == 1) {
        result += abc[random2]
      } else if (random == 2) {
        result += random3 + abc[random2]
      } else {
        result += abc[random2].toUpperCase()
      }
    }
  }
  return result;
};

function cifrado(texto){
  let result = crypto.createHash('sha256').update(""+texto).digest('hex');
  let mitad = Math.floor(result.length / 2);
  let primeraMitad = result.substring(0,mitad);
  let segundaMitad = result.substring(mitad,result.length);
  let nuevo = segundaMitad+""+primeraMitad;
  let final = nuevo.split("").reverse().join("");
  return final;
}

router.post("/resetPassword",(req,res)=>{
   // mailOptions("Restablecer Contraseña","Hola","jansforte@gmail.com");
   const emailxUsuariox = req.body.emailxRecovery;
   
   const connection = mysqlConnection;
   let userName='';
   let newPassword = generarString(8);
   
   connection.query("SELECT UPPER(a.nombreUsuariox) as username FROM tbl_usuarios a WHERE a.emailxUsuariox= ? ",
    [emailxUsuariox], 
        (error, result)=>{

            if(result.length){
              userName = result[0]['username'];
              
              const txt = `
              Hola ${userName},
              <br>Recientemente hemos recibido una solicitud para restablecer su contraseña.
              <br>Tu nueva clave es:
              Password: <b>${newPassword}</b>

              <br>Usted podrá cambiar esta clave temporal una vez ingrese a la plataforma.
              `;
            
              let mail = mailOptions("Restablecer Contraseña",txt,emailxUsuariox);

              transporter.sendMail(mail, function(error, info){
                  if (error) {
                    console.log(error);
                    res.status(200).send(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                    let passCifrad = cifrado(newPassword);
                    connection.query("UPDATE tbl_usuarios a SET clavexUsuariox=? WHERE a.emailxUsuariox= ? ",[passCifrad, emailxUsuariox]);
                    res.status(200).send("OK");
                  }
                });
                
            }
            
            
        });
    connection.end; 
    
});

function notifyAsesorias(codigoAsesoria,tipoSms){
  const connection = mysqlConnection;
  
  connection.query("SELECT a.descriAsesoria,COALESCE(a.fechaxAsesoria,0) fechaxAsesoria, a.horaxxInicioxx,\
  a.horaxxFinalxxx,a.descriCambioxx, \
  UPPER(b.nombreDocentex) nombreDocentex, b.emailxUsuariox as emailxDocentex,\
  UPPER(CONCAT(c.nombreEstudnte,' ',c.apelliEstudnte)) nombreEstudnte, c.emailxUsuariox as emailxEstudnte,\
  FROM tbl_asesoria a, tbl_docentex b,tbl_estudnte c WHERE a.codigoAsesoria= ? \
  AND a.codigoDocentex = b.codigoDocentex AND a.codigoEstudnte = c.codigoEstudnte",[codigoAsesoria],(error,results)=>{
    if(results){
      let toUser = "";
      let estudiante =results[0]['nombreEstudnte'];
      let descripcion =results[0]['descriAsesoria'];
      let fecha =results[0]['fechaxAsesoria']== 0 ? 'N/A' : results[0]['fechaxAsesoria']+" ("+results[0]['horaxxInicioxx']+" - "+results[0]['horaxxFinalxxx']+")" ;
      let descripCambio =results[0]['descriCambioxx'];
      let emailxUsuariox="";
      let sms = "";
      let asunto = "Solicitud de Asesoria";
      switch(tipoSms){
        case 1: 
          toUser = results[0]['nombreDocentex'];
          asunto = "Solicitud de Asesoria";
          emailxUsuariox = results[0]['emailxDocentex'];
          sms = "Te informamos que un emprendedor ha solicitado de tu asesoria para progresar en sus ideas revolucionarias."; 
          break;
        case 2: 
          toUser = results[0]['nombreEstudnte'];
          asunto = "Solicitud de Asesoria Aceptada";
          emailxUsuariox = results[0]['emailxEstudnte'];
          sms = "Te informamos que tu solicitud de asesoria ha sido evaluada y programada para el día: "+results[0]['fechaxAsesoria']+"\
          desde "+results[0]['horaxxInicioxx']+" a "+results[0]['horaxxFinalxxx']+"."; 
          break;
        case 3: 
          toUser = results[0]['nombreEstudnte'];
          emailxUsuariox = results[0]['emailxEstudnte'];
          asunto = "Asesoria Cancelada";
          sms = "Te informamos que tu asesor ha cancelado la asesoría del día: "+results[0]['fechaxAsesoria']+"\
          de "+results[0]['horaxxInicioxx']+" a "+results[0]['horaxxFinalxxx']+"."; 
          break;
        case 4: 
          toUser = results[0]['nombreDocentex'];
          asunto = "Solicitud de Cambio/Canceclación de Asesoria";
          emailxUsuariox = results[0]['emailxDocentex'];
          sms = "Te informamos que un emprendedor ha solicitado cambio/cancelación de la reunión agendado."; 
          break;
      }

      const txt = `
              Hola ${toUser},
              <br>${sms}
              <br>A continuación encontrarás más información al respecto:
              <br><b>Emprendedor:</b> ${estudiante}
              <br><b>Descipción Asesoria:</b> ${descripcion}
              <br><b>Fecha y Hora:</b> ${fecha}
              <br><b>Descripción Solicitud de Cambio:</b> ${descripCambio}
              `;
      let mail = mailOptions(asunto,txt,emailxUsuariox);
      transporter.sendMail(mail,function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  });
  connection.end; 
}

function notifyActas(data,file){
  return new Promise((resolve)=>{
    const {emailxEnviarxx, observEnviarxx, temaxxActaxxxx,
      nombreTipoacta, fechaxActaxxxx} = data;
    const dataFile =[{
      filename: 'Acta.pdf',
      content: file.buffer
    }]
    let sms = "Te informamos que se ha compartido contigo un acta.";
    const txt = `
                Hola,
                <br>${sms}
                <br>A continuación encontrarás más información al respecto:
                <br><b>Tema:</b> ${temaxxActaxxxx}
                <br><b>Tipo de Acta:</b> ${nombreTipoacta}
                <br><b>Fecha y Hora:</b> ${fechaxActaxxxx}
                <br><b>Observación:</b> ${observEnviarxx}
                `;
        let mail = mailOptions("Notificacion de Acta CREPIDS - "+temaxxActaxxxx,txt,emailxEnviarxx,dataFile);
    
    
      transporter.sendMail(mail,function(error, info){
        if (error) {
          //console.log(error);
          resolve([{"estado":false,"message":"Error al Enviar el acta"}]);
        } else {
          //console.log('Email sent: ' + info.response);
          
          resolve([{"estado":true,"message":"Acta Enviada Correctamente"}]);
        }
      });
  });
      
}

router.get("/prueba",(req,res)=>{

  let mail = mailOptions("Restablecer Contraseña",'<h1>Cuerpo del mensaje en HTML</h1>','jansforte@gmail.com');
  transporter.sendMail(mail, function(error, info){
    if (error) {
      console.log(error);
      res.status(200).send(error);
    } 
    else {
      console.log('Email sent: ' + info.response);
      res.status(200).send(info.response);
    }
  });
})

 
module.exports = {router,notifyAsesorias, notifyActas}; 