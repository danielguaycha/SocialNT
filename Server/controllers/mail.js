const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 465,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "3d9af5e02d3b80", // generated ethereal user
      pass: "19fa012c26c4ca" // generated ethereal password
    }
});

async function sendConfirmMail(to, user, user_id, token){
    
    let info = await transporter.sendMail({
        from: `"${user} 👻" <admin@socialnt.com>`, // sender address
        to, // list of receivers
        subject: "Confirma tu cuenta SocialNT",
        text: "Listo para empezar", 
        html: `
            <b>Confirma tu cuenta</b>
            <p>
                <a href="${ process.env.CLIENT_URL }/confirm/${user_id}/${token}" target="_blank">Click para confirmar</a>
            </p>
            `
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = {
    sendConfirmMail
}