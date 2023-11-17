const Product = require("../models/product");


const getProducts = async(req, res) => {
    try {
        //paginado de usuarios
        const { limite = 5, desde = 0} = req.query;
        
        if (isNaN(limite) || isNaN(desde)) {
            res.send({message:'El límite y/o el valor "desde" deben ser números'});
            return;
        }

        const products = await Product.find({ estado: true })
        .populate('user', 'name')
        .populate('category', 'name')
        .skip(desde)
        .limit(limite)

        const total = await Product.countDocuments({ estado: true });

        res.send({
            total,
            products
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error en el servidor' });
    }
};



const getProductID = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
                            .populate('user', 'name')
                            .populate('category', 'name')

    res.json(product)
};



const postProducts = async(req, res) => {
    
    const {estado, user, ...body} = req.body
    const name = req.body.name.toUpperCase();

    const productBD = await Product.findOne({ name })
    if (productBD) {
        return res.status(400).send({message: `El Producto ${name}, ya existe`})
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
};



const putProduct = async(req, res) => {
    const { id } = req.params;
    const { estado, user, ...data } = req.body;

    if (data.name ) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product)
};

const deleteProduct = async(req, res) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json({message:'Categoria eliminada correctamente', product });
};



module.exports = {
    getProducts,
    getProductID,
    postProducts,
    putProduct,
    deleteProduct
}