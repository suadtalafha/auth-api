'use strict';

module.export=(req,res,next)=>{
const error={
    status:404,
    message:'NOt Found'
}
res.status(404).json(error)
}