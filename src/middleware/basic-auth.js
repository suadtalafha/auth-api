'use strict';

const base64=require('base-64');

module.exports=(users)=>(req,res,next)=>{
if(!req.headers.authorization){
    next('Invaild login');
    return
}
const encodedCredintial=req.headers.authorization.split(' ').pop();
const [username,password]=base64.decode(encodedCredintial).split(':');

users.authenticateBasic(username,password)
.then((user)=>{
req.user=user;
next();

})
.catch((err) => next('Invalid login'));
}