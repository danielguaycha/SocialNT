const jwt = require('jsonwebtoken');

let auth = ( req, res, next) => {

    // validar si viene el token
    let token = req.get('Authorization');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.status(401).send({ message: "No autorizado", ok: false });

        req.user = decoded.user;

        next();
    })

    //next();
} 

module.exports = auth;