const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "bboy.ixio@gmail.com", // generated ethereal user
      pass: "0929421204" // generated ethereal password
    }
});

async function sendConfirmMail(to, user, user_id, token){
    
    let info = await transporter.sendMail({
        from: `"${user} 👻" <admin@rs.com>`, // sender address
        to, // list of receivers
        subject: "Confirma tu cuenta RS",
        text: "Listo para empezar", 
        html: `
            <b>Confirma tu cuenta</b>
            <p>
                <a href="${ process.env.CLIENT_URL }/confirm/${user_id}/${token}" target="_blank">Click para confirmar</a>
            </p>
            `
    });

    console.log("Register sent: %s", info.messageId);
}

async function sendResetPasswordMail(to, token){
    
    let info = await transporter.sendMail({
        from: `"👻" <admin@rs.com>`, // sender address
        to, // list of receivers
        subject: "Recuperación de contraseña",
        text: "Recupera tu contraseña", 
        html: `
            <b>Para recuperar tu contraseña ve al enlace abajo!</b>
            <p>
                <a href="${ process.env.CLIENT_URL }/reset_password/${token}" target="_blank">Recuperar mi contraseña</a>
            </p>
            `
    });

    console.log("Confirm sent: %s", info.messageId);
}

module.exports = {
    sendConfirmMail, sendResetPasswordMail
}