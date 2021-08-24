'use strict';

module.exports=(error,req,res,next)=>{
    const errorMesg=error.message ? error.message :error;
    const erroObj={
        status:500,
        message:errorMesg
    }
    res.status(500).json(erroObj)
}