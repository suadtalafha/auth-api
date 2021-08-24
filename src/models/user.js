'use strict';

const bcrypt=require('bcrypt');
const jwt=require('jasonwebtoken');
const { Sequelize, DataTypes } = require('sequelize/types');
const SECRET=process.env.JWT.SECRET ||'super-secret';

const users=(sequelize,DataTypes)=>{
const model=sequelize.define('user',{
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        uniqe:true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    role:{
        type:DataTypes.ENUM('user','writer','editor','admin'),
        defaultValue: 'user'
    },
    capabilities:{
        type:DataTypes.VIRTUAL,
        get(){
            const acl={
                user:['read'],
                writer: ['read', 'create'],
                editor: ['read', 'create', 'update'],
                admin: ['read', 'create', 'update', 'delete'],
            };
            return acl[this.role]
        }
    },
    token:{
        type:DataTypes.VIRTUAL,
        get(){
            console.log('suaddd',this.capabilities);
            return jwt.sign({
                username: this.username,
                capabilities: this.capabilities
            },SECRET)
        },
        set(tokenObj) {
            let token = jwt.sign(tokenObj, SECRET);
            return token;
        },
    }
});
model.beforeCreate(async(user)=>{
    let hash=await bcrypt.hash(user.password,10);
    user.password=hash
});
model.authenticateBasic =async function(username,password){
    const user=await this.finOne({where:{username}});
    const isVaild=bcrypt.compare(password,user.password);
    if(isVaild){
        return user
    }
    throw new Error('Invalid user');
}
model.authenticateBearer = async function (token) {
    console.log(token);
    console.log(jwt.decode(token));

    const verifiedToken = jwt.verify(token, SECRET);

    //if not verfiied you need to throw an error
    const user = await this.findOne({ where: { username: verifiedToken.username } });

    if (user) { return user; }
    throw new Error('Invalid user');

}

return model;
}

module.exports = users;
