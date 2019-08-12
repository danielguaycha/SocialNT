const fs  = require('fs')
const path  = require('path')
const Publication = require('./../models/publication');
const Follow = require('./../models/follow');
const User = require('./../models/user')
const fn = require('./fn');
const uploadController = require('./upload')

async function savePublication(req, res){
    let r = req.body;
    let user_id = req.user.id;
    let image = '';
    if(!r.text && !(req.files && req.files.image) )
        return fn.error(res,"Ingresa un contenido");

    if(req.files && req.files.image)
        image = await uploadController.upload(req.files.image, 'publications');

        console.log(fn.date());
    Publication.create({
        text: r.text,
        image: (image !== '' ? image.fileName : null ),
        user_id: user_id,
        created_at: `${fn.date()}`    
    }).then( publication => {
        if(!publication) return fn.error(res, "No pudo procesar su petición");

        return fn.all(res, publication);
    }).catch(err => {
        console.log(err);
        return fn.except(res, err)
    })
}

async function list(req, res){
    let page = 1;
    let limit = 7;

    let follows = await Follow.findAll({ 
        attributes: ['followed'],
        where: {
            user_id: req.user.id,        
        },
    });
    let followeds = [];
    for(let f in follows){
        followeds.push(follows[f].followed);
    }

    // pagination
    if(req.query.page )
        page = req.query.page;

    // limit
    if(req.query.limit )
        limit = req.query.limit;

    // find publication
    let lo = fn.limit_offset(page, limit);
   
    Publication.findAll({ 
        where: {
            [Op.or]: [
                {user_id: req.user.id}, 
                {user_id: 
                    {[Op.in]: followeds} 
                }
            ]
        }, 
        include: [{model: User, attributes: ['name', 'lastname','avatar', 'id']}],
        order: [['created_at','desc']],
        limit: lo.limit,
        offset: lo.offset
    }).then(publication => {
        return fn.object(res, {ok:true, data: publication});
    }).catch(err => {
        console.log(err);
        fn.except(res, err)
    });
}

function getPublicationsForUser(req, res){
    let page = 1;
    let user_id = req.params.id;

    if(req.query.page)
        page = req.query.page;

    let lo = fn.limit_offset(page, 7);

    Publication.findAll({
        where: { user_id },
        limit: lo.limit,
        offset: lo.offset,
        order: [ ['created_at', 'desc'] ],
        include: [{model: User, attributes: ['name', 'lastname','avatar', 'id']}],
    }).then(publications => {
        return fn.all(res, publications)
    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    });
}

async function removePublication(req, res){
    let user_id = req.user.id;
    let publication_id = req.params.id;

    let p = await Publication.findByPk(publication_id);

    if(!p) return fn.error(res, "No se encnntró la publicación", 404);

    if( p.user_id !== user_id ) return fn.error(res, "No tienes permiso para eliminar esta publicación")

    p.destroy().then( () => {
        return fn.object(res,{ok: true, id: publication_id, message: "Publicación eliminada con exito"});
    });
}

function getImage(req, res){
    let image_file = req.params.imageFile;
    let path_file = './uploads/publications/'+image_file;
    fs.exists(path_file, exist => {
        if(exist)
             res.sendFile(path.resolve(path_file));
        else
            return res.status(200).send({message:"No existe la imagen"})
    })
}

function viewPublication(req, res){
    let id = req.params.id;
    Publication.findOne({
        where: {id},
        include: [{model: User, attributes: ['name', 'lastname','avatar', 'id']}],
    }).then(publication => {
        if(!publication) return fn.error(res, 'No se encontró la publicación');

        return fn.all(res, publication);
    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })
}

module.exports = {
    savePublication, list, getImage, 
    removePublication, getPublicationsForUser, viewPublication
}