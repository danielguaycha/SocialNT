const fn = require('./fn');
module.exports = {
    //lester.meco.png
    upload(file, folder='users'){        
        return new Promise( ( resolve, reject ) => {
            let nametmp = file.name.split('.');
            let ext = nametmp[nametmp.length - 1];
        
            let validExts = ['jpg', 'png', 'jpeg'];

            if(validExts.indexOf(ext) < 0 ){
                reject("Extension no válida");
            }

            let fileName = `${Math.round((new Date()).getTime()/1000)}.${ext}`;
            file.mv(`uploads/${folder}/${fileName}`, (err) => {
                if(err){ console.log(err); reject(null)}
                
                resolve({ fileName, ext })
            });
        })
        //return { fileName, ext };
    }
}