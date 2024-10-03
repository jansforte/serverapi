const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
   auth:{
    type:'OAuth2',
    user:'johan.fuentes01@uceva.edu.co',
    clientId:'326745624124-323aetcmhc8dkcdkv22nselke6umb5ue.apps.googleusercontent.com',
    clientSecret:'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',
    refreshToken:'1//0535B0gxvSQyACgYIARAAGAUSNwF-L9IrUW2sONl454xuJbWGi3caIhOsdNAo0nMEOjz9-BQptFxIuYchSrr-jqh7zUQrM6hZbew',
    accessToken:'ya29.a0AcM612y4dSAKM2iVoFCkgbeeo3a5n1PJB_E8-BYs_p5TgnoANqpfuLDjbMUfFsgRjhPJSBVaJD4xZYmw32JvsT80yVONZg0tOMteIPkEKH7w415K2hXfmoAyUNgPvS82wGPDi1lYiYd5RycuTL5I4wAfU087GQWAHfyxqJKJaCgYKAQsSARASFQHGX2Mi4eoS5yCBYvzEv9uubiRn1w0175'
   }
  });

let htmlMail = (msg)=>{
    let logo ="https://raw.githubusercontent.com/jansforte/Practica/master/crepids.png";
    let color1 = '\
    background: -moz-linear-gradient(133deg, rgba(237,237,99,1) 0%, rgba(254,71,86,1) 17%, rgba(171,1,247,1) 96%); \
    background: -webkit-linear-gradient(133deg, rgba(237,237,99,1) 0%, rgba(254,71,86,1) 17%, rgba(171,1,247,1) 96%); \
    background: linear-gradient(133deg, rgba(237,237,99,1) 0%, rgba(254,71,86,1) 17%, rgba(171,1,247,1) 96%); \
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#eded63",endColorstr="#ab01f7",GradientType=1);';

    let color2 = "#fe4756";
    let width = 600;
    let color3 = "#fff";
    let html = "<!doctype html>";
    html += "<html>";
    html += "<head>";
    html += "<title>CREPIDS LOGUIN</title>";
    html += "</head>";
    html += "<body style='font-size:14px;'>";  
    html += "<style> @import url(http://fonts.googleapis.com/css?family=Open+Sans); </style>"; 
    html += "<table align='center' style='width: "+width+"px; border:0px solid #ddd; ' >";                    
    
    html += "<tr>";
    html += "<td align='center'>";

    let logoBlanco  = "https://raw.githubusercontent.com/jansforte/Practica/master/crepids.png";
        html += "<div style='background-color: "+color3+"; color: #fff;'>"; 
        html += "<a href='http://192.168.1.9/'>"; 
            html += "<img style='height: 180px' src='"+logoBlanco+"'>";    
        html += "</a>";   
        html += "</div>";

       // html += "<div style='background-color: "+color2+"; width: "+width+"px;'>&nbsp;</div>";
        html += "<div style='"+color1+"; width: "+width+"px;'><br>&nbsp;<br></div>";
    html += "</td>";        
    html += "</tr>";

    html += "</table>";

    html += "<table align='center' style='width: "+width+"px; border:1px solid #ddd' cellpadding=10 cellspacing=10  >";                    

        html += "<tr>";
        html += "<td align='left'>";        
        html += msg;        
        html += "</td>";   
        html += "</tr>";
        
    html += "</table>";
        
    html += "<table align='center' style='width: "+width+"px; border:0px solid #ddd; ' >"; 
        html += "<tr>";
        html += "<td align='center'>";
            html += "<div style='"+color1+"; width: "+width+"px;' align='center'>";
            html += "<br>";
            html += "<a style='color: #fff; text-align:center' href='http://192.168.1.9/'>www.crepids.edu.co</a>";
            html += "<br>";
            html += "<br>";
            html += "</div>";
        html += "</td>";        
        html += "</tr>";
    html += "</table>";

    html += "</body>";
    html += "</html>";
    return html;
}

let mailOptions = (asunto="",msg="",correos="", adjuntos=[]) => {
    let objeto = {
        from: 'johan.fuentes01@uceva.edu.co',
        to: correos,
        subject: asunto,
        html: htmlMail(msg),
        attachments: adjuntos
    }
    return objeto;
};

module.exports = {transporter, mailOptions};
//module.exports = mailOptions;
