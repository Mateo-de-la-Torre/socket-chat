

const isAdminRole = (req, res, next) => {
    if (!req.user) {
        return res.status(500).send({message: 'Se quiere verificar el rol sin validar el token'})
    }

    const { rol, name } = req.user;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).send({message: `${name} no tiene privilegios de administrador`})
    }

    next()
}

module.exports= {
    isAdminRole
}