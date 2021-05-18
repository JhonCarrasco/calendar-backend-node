const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');


const createUser = async (req, res = response) => {

    const data = req.body;
    const { name, email, password } = data;

    try {
        let _user = await User.findOne({ email: email });
        
        if ( _user ) {
            res.status(400).json({
                ok: false,
                msg: 'User already exists with that email'
            });
        }

        const user = new User(data);

        // cifrar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // generar jwt
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

        
    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: 'Try with your administrator'
        });
    }
};

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email: email });
        
        if ( !user ) {
            res.status(400).json({
                ok: false,
                msg: 'User not exists with that email'
            });
        }

        // confirmar los password
        const validPassword = bcrypt.compareSync(password, user.password);
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrect'
            });
        }

        // generar jwt
        const token = await generateJWT( user.id, user.name );


        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });


    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: 'Try with your administrator'
        });
    }

}
const refreshToken = async (req, res = response) => {

    const { uid, name } = req;

    const token = await generateJWT( uid, name );

    if( token ) {
        return res.status(202).json({
            ok: true,
            uid,
            name,
            token
        });
    } else {
        return res.status(400).json({
            ok: false
        });
    }

    
}


module.exports = {
    createUser,
    login,
    refreshToken
}