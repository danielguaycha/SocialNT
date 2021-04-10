const dotenv = require( 'dotenv');
dotenv.config();

const nodemailer = require("nodemailer");
const mailUser = process.env.MAIL_USER || 'mail@gmail.com';
const mailPw = process.env.MAIL_PASSWORD || '123';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: mailUser, // generated ethereal user
      pass: mailPw // generated ethereal password
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
