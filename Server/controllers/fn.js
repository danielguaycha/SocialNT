
module.exports = {

    error(res, msg, code=400){
        return res.status(code).send({
            ok: false,
            message: msg            
        })
    },

    ok(res, msg){
        return res.status(200).send({
            ok: true,
            message: msg
        })
    },

    all(res, data){
        return res.status(200).send({
            ok: true,
            data
        })
    },

    object(res, object){
        return res.status(200).send(object)
    },

    except(res, err, msg=''){
        return res.status(400).send({
            ok: false,
            err,
            msg
        })
    },

    date(){
        return new Date().toLocaleString('es-Es', { timeZone: 'America/Guayaquil'});
    },

    limit_offset(page, pageSize = 10){
        
        if(page< 1)
            page = 1;

        const offset = (page-1) * pageSize;
        const limit = parseInt(pageSize);    
        return {
            offset, limit
        } 
    },

    validPublication(type){
        return (type === 'pub' || type === 'market')
    },
}