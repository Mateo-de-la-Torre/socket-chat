const User = require('../models/user');
const bcrypt = require('bcrypt');

const getUser = async (req, res) =>{

    try {
        //paginado de usuarios
        const { limite = 5, desde = 0} = req.query;
        
        if (isNaN(limite) || isNaN(desde)) {
            res.send({message:'El límite y/o el valor "desde" deben ser números'});
            return;
        }
    
        const users = await User.find({ estado: true })
        .skip(desde)
        .limit(limite)

        const total = await User.countDocuments({ estado: true });
    
        res.send({
            total,
            users
        })

        
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error en el servidor' });
    }
}

const postUser = async(req, res) => {
    
    try {
        
        const {name, email, password, rol, image } = req.body;
        const passwordHash = await bcrypt.hash( password, 10 );
        
        const user = new User({name, email, password: passwordHash, rol, image});
        await user.save(); //guarda en BD

        res.json({
            user
        });
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }

}

const putUser = async (req, res) => {
    const { id } = req.params;
    const {_id, email, password, google, ...restUser} = req.body;

    if (password) {
        await bcrypt.hash( password, 10 );
    }

    const user = await User.findByIdAndUpdate(id, restUser)

    res.json(user)
}

const deleteUser = async(req, res) => {
    
    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { estado: false });

    res.json({message:'Usuario eliminado correctamente', user });
}

const patchUser = async (req, res) => {
    
}




module.exports= {
    getUser,
    postUser,
    putUser,
    deleteUser,
    patchUser
}