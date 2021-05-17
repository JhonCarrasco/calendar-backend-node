const { response } = require('express-validator');
const jwt = require('jsonwebtoken');


const jwtValidator = ( req, res = response, next ) => {

    // x-token headers
    const token = req.header('x-token');
    
    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'There is not token in the request'
        });
    }

    try {
        const payload = jwt.verify( token, process.env.SECRET_JWT_SEED );
        // pasamos valores al request, que serán enviados al controlador
        req.uid = payload.uid;
        req.name = payload.name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    }

    next();

}


module.exports = {
    jwtValidator
}