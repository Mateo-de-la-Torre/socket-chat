const Category = require('../models/category');


const getCategories = async (req, res) => {
   
    try {
        //paginado de usuarios
        const { limite = 5, desde = 0} = req.query;
        
        if (isNaN(limite) || isNaN(desde)) {
            res.send({message:'El límite y/o el valor "desde" deben ser números'});
            return;
        }

        const categories = await Category.find({ estado: true })
        .populate('user', 'name')
        .skip(desde)
        .limit(limite)

        const total = await Category.countDocuments({ estado: true });

        res.send({
            total,
            categories
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error en el servidor' });
    }
};



const getCategoryID = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'name');
    

    res.json(category)
};


const postCategories = async (req, res) => {

    const name = req.body.name.toUpperCase();

    const categoryBD = await Category.findOne({ name })
    
    if (categoryBD) {
        return res.status(400).send({message: `La categoria ${name}, ya existe`})
    }

    const data = {
        name,
        user: req.user._id
    }

    const category = new Category(data);
    await category.save();

    res.status(201).json(category);
};




const putCategories = async (req, res) => {
    const { id } = req.params;
    const { estado, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json(category)
};


const deleteCategories = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json({message:'Categoria eliminada correctamente', category });
};




module.exports = {
    getCategories,
    getCategoryID,
    postCategories,
    putCategories,
    deleteCategories
}



