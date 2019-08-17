const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const fn = require('./fn');
const uploadController = require('./upload');
const emailController = require('./mail');
const {User, PasswordReset} = require('./../db');
const { isFollow, getByUsername } = require('./follow')

// Guardar usuario
function saveUser(req, res){

    let r = req.body;

    if(!r.name || !r.lastname || !r.email || !r.username || !r.password || !r.genero){
        return fn.error(res, "Existen datos que son requeridos");
    }

    User.findOne({ where: {  [Op.or]: [{email:r.email}, {username: r.username}] }}).then( user => {
        if(user) return fn.error(res, "Una persona ya se ha registrado con este usuario o email ");
        
        User.create({
            name: r.name,
            lastname: r.lastname,
            email: r.email,
            username: r.username,
            password: bcrypt.hashSync(r.password, 10),
            genero: r.genero,
            avatar: process.env.AVATAR,
            confirmation_code: randomstring.generate(50)
        }).then( user => {
            if(!user) return fn.error(res, "No se ha podido guardar el usuario");
            
            if(process.env.CONFIRM_MAL){
                emailController.sendConfirmMail(
                    user.email, 
                    user.name+" "+user.lastname,
                    user.id,
                    user.confirmation_code
                );
                return fn.ok(res, "Hemos enviado un email, revise su correo para continuar");
            }

            return fn.all(res, user);

        }).catch( err => {
            return fn.except(res, err);
        });

    }).catch( err => {
        return fn.except(res, err);
    });
}

// Actualizar usuario
function updateUser(req,res){
    let id = req.user.id;
    let r = req.body;
    if(!id) return fn.error(res, "Es necesario ingresar un id");
    //if(!r.name || !r.lastname || !r.email || !r.username){
    //  return fn.error(res, "Existen datos que son requeridos");
    //}
    User.update({
        name: r.name,
        lastname: r.lastname,
        email: r.email,
        username: r.username,
        genero: r.genero
    }, { where: { id: id }, returning: true }).then( rows => {    
        return fn.all(res, rows[1][0]);    
    }).catch( err => {
        return fn.except(res, err)
    });
}

// Encontrar usuario por id
function findUser(req, res){
    let id = req.params.id;
    if(!id)
        return fn.error(res, "Se requiere un usuario");
    User.findOne({ where: {id: id} }).then(async user => {
        if(!user) return fn.error(res, "No se encontró el usuario");
        user.dataValues.isFollow = await isFollow(req.user.id, user.id);  

        return fn.object(res, {ok:true, user});

    }).catch( err => {
        return fn.except(res,err);
    })
    
}

// Encontrar todos los usuarios 
async function findAll(req, res){
    let data = req.params.data;
    if(!data)
        return fn.error(res, "Se requiere un usuario");

    let clearData = `%${data.replace('@', '')}%`
    let users = await User.findAll({ limit:15, where: {
        [Op.or]: [
            { username: { [Op.like]: clearData } }, 
            {email: { [Op.like]: clearData }},
            {name: { [Op.like]: clearData }},
            {lastname: { [Op.like]: clearData }},
        ]
    }});
    
  
    if(!users) return fn.error(res, "No se encontró coincidencias");

    for(u in users){
        users[u].dataValues.isFollow = await isFollow(req.user.id, users[u].id);
    }

    return fn.object(res, {ok:true, users: users});
}

// login
function login(req, res){
    let r = req.body;

    if(!r.email || !r.password)
        return fn.error(res, "Usuario y contraseña son requeridos")    ;

    User.findOne({
        where: { email: r.email }
    }).then( user => {
        if(!user) return fn.error(res, "(Usuario) o Contraseña incorrectos");

        if(!bcrypt.compareSync(r.password, user.password)) 
            return fn.error(res, "Usuario o (Contraseña) incorrectos");

        if(process.env.CONFIRM_MAL){
            if(user.confirmation_code !== null || user.confirmed === 0)
                return fn.error(res, 'Confirme su correo para iniciar sesión!')
        }
        // creamos sesion mediante token
        let token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED } );

        return fn.all(res, { user, token })
        
    }).catch( err => {
        console.log(err);
        return fn.except(res, err);
    })

}


// cambiar contraseña
function changePassword(req,res){    
    let r= req.body;
    if(!r.last_password || !r.new_password){
        return fn.error(res, "Datos requeridos")
    }

    User.findOne({
        where: { email: req.user.email }
    }).then( user => {
        if(!user) return fn.error(res, "Contraseña incorrecta");

        if(!bcrypt.compareSync(r.last_password, user.password)) 
            return fn.error(res, "Contraseña incorrecta");

        // creamos sesion mediante token
        user.update({ password: bcrypt.hashSync(r.new_password, 10),})

        return fn.ok(res, "Contraseña actualizada con éxito")
        
    }).catch( err => {
        console.log(err);
        return fn.except(res, err);
    })
    
}

// subir imagen al servidor
async function uploadAvatar(req, res){
    let user_id = req.user.id;    
    if(req.files){
        if(!req.files.file) return fn.error(res, "No se ha enviado un archivo");        

        let uploads = await uploadController.upload(req.files.file);    

        //delete avatar file
        removeAvatar(user_id);
      
        
        User.update({
            avatar: uploads.fileName
        }, { where: { id: user_id }}).then( row =>{
            return fn.object(res, {uploads, ok:true});
        })
    }else{
        return fn.error(res, "No se ha enviado un archivo")
    }
}

// confirm mail
async function confirmMail(req, res){
    let user_id = req.params.user;
    let token = req.params.token;

    if(token.trim().length < 50 || token.trim().length > 50){
        return fn.error(res, 'Token de confirmación no válido');
    }

    let user = await User.findOne({
        where: { id: user_id, confirmation_code: token }
    })

    if(!user){
        return fn.error(res, 'La solicitud requerida ha caducado')
    }

    user.update({
        confirmation_code: null,
        confirmed: 1
    }).then( userUpdated => {
        if(!userUpdated){
            return fn.error(res, 'La solicitud requerida ha caducado')
        }

        return fn.ok(res, 'Correo confirmado con éxito');
    }).catch(err => {
        console.log(err);
        return fn.except(res, err)
    })    
}

// eliminar avatar
function removeAvatar(user_id){
    
    User.findByPk(user_id, { attributes: [ 'avatar']}).then(user =>{
        if(!user) return;

        if(user && user.avatar){

            if(user.avatar ===  process.env.AVATAR)
                return;

            let path = `./uploads/users/`+user.avatar;
            if(fs.existsSync(path))
                fs.unlinkSync(path)
        }
    }).catch(err => {
        console.log(err);
    })
}

// obtener imagenes
function getImage(req, res){
    let image_file = req.params.imageFile;
    let path_file = './uploads/users/'+image_file;
    fs.exists(path_file, exist => {
        if(exist)
             res.sendFile(path.resolve(path_file));
        else
            return res.status(200).send({message:"No existe la imagen"})
    })
}

// get users for chat
function getUserForOnline(req, res){
    let username = req.params.username;

    User.findOne({
        where: {username},
        attributes: ['id', 'name', 'lastname', 'avatar', 'username']
    }).then(async user => {
        if(!user) return res.send({ ok: false });

        let isfollow = await isFollow(req.user.id, user.dataValues.id);

        if(isfollow){
            return fn.all(res, user);
        }
        else {
            return res.send({ ok: false });
        }
    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })
}

async function getAllUsersForOnline(req, res){

    if(!req.body.users)
        return fn.object(res, [])

    let users = [];
    for (let u of req.body.users){
        let user = await getByUsername(u);
        
        if (user) {
            let isfollow = await isFollow(req.user.id, user.id);
            if (isfollow)
                users.push(user);
        }        
    }

    return fn.all(res, users);
}

//============================
//		FaceId Login
//============================

function loginFaceId(req, res) {
    if (!req.body.hash) return fn.error(res, 'Credenciales incorrectas');

    User.findOne({
        where: { hash: req.body.hash }
    }).then( user => {
        if(!user) return fn.error(res, "No se registró su rostro!");

        if(process.env.CONFIRM_MAL){
            if(user.confirmation_code !== null || user.confirmed === 0)
                return fn.error(res, 'Confirme su correo para iniciar sesión!')
        }
        // creamos sesion mediante token
        let token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED } );

        return fn.all(res, { user, token })
        
    }).catch( err => {
        console.log(err);
        return fn.except(res, err);
    })
}

function getHash(req, res) {
    let hashRandom = randomstring.generate(10); 
    let stringHash = `${hashRandom}_${req.user.username}.${req.user.id}`;

    User.findByPk(req.user.id).then(user => {
        return fn.object(res, {ok: true, newHash: stringHash, oldHash: user.hash});
    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })

}

function updateHash(req, res) {
    if(!req.body.hash)
        return fn.error(res, 'Proporcione un hash para actualizar!');

    User.findByPk(req.user.id).then(user => {

        if(!user) return fn.error(res, 'No se encontró el usuario');

        user.update({ hash: req.body.hash }).then(updated => {
            return fn.all(res, updated);
        });
    })
}

//============================
//		Reset Password
//============================

function sendResetPasswordCode(req, res){
    let r = req.body;

    if(!r.email) { return fn.error(res, 'Proporcine un email'); }

    User.findOne({ where: { email: r.email }}).then(user => {

        if(!user) return fn.error(res, 'El email proporcionado no coincide con nuestros registros');

        PasswordReset.create({
            email: user.email,
            token: `${randomstring.generate(55)}${user.id}`,
            created_at: `${fn.date()}`
        }).then(reset => {
            if(!reset) return fn.error('No se pudo enviar su correo de recuperación');
            
            emailController.sendResetPasswordMail(reset.email, reset.token);
        
            return fn.ok(res, 'Te hemos enviado un correo con la información necesaria para restablecer tus contraseña');
        }).catch(err => {
            console.log(err);
            return fn.except(res, err);
        })
        
    }).catch(err => {        
        console.log(err);
        return fn.except(res, err);
    })

}

function resetPassword(req, res) {
    let r = req.body;

    if(!r.email || !r.token || !r.password) {
        return fn.error(res, 'Complete el formulario primero!');
    }

    PasswordReset.findOne({ where: { email: r.email, token: r.token }, order:[['created_at', 'desc']]})
        .then(reset => {
            if(!reset) return fn.error(res, 'Token o correo no validos o expirados');

            // Cambiar contraseña en la base de datos
            User.findOne({
                where: { email: reset.email }
            }).then(user => {
                if(!user) return fn.error(res, 'No existe un usuario con este correo');

                user.update({ password: bcrypt.hashSync(r.password, 10) });
                reset.destroy();

                return fn.ok(res, 'Su contraseña fue restablecida con éxito');
            }).catch(err => {
                console.log(err);
                return fn.except(res, err);
            })

        }).catch(err => {
            console.log(err);
            return fn.except(res, err);
        })
}

module.exports = {
    saveUser, 
    findUser, 
    updateUser, 
    findAll, 
    login, 
    uploadAvatar, 
    getImage, 
    changePassword,
    confirmMail,
    getUserForOnline,
    getAllUsersForOnline,
    getHash, updateHash,
    loginFaceId,
    sendResetPasswordCode,
    resetPassword
}