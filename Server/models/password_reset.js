const Sequelize = require('sequelize');
class PasswordReset extends Sequelize.Model {


    static init(sequelize){

        //super.removeAttribute('id');

        return super.init({        
            email: Sequelize.STRING,        
            token: Sequelize.STRING,        
            created_at: Sequelize.STRING,              
        },
        {
            sequelize: sequelize,
            modelName: 'passwor_reset',
            tableName: 'password_resets',
            timestamps: false,   
            defaultPrimaryKey: false
        })

    }

    static associate(models){

    }
}


module.exports = PasswordReset