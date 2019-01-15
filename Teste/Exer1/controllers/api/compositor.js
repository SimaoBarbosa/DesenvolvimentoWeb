var Compositor = require('../../models/compositores')

module.exports.listar = () => {
    return Compositor
        .find({},{"@id":true,nome:true,dataNasc:true,"_id": false})
        .exec()
}

module.exports.consultar = id => {
    return Compositor
        .find({"@id": id})
        .exec()
}

module.exports.consultarPeriodo = periodo => {
    return Compositor
        .find({periodo: periodo})
        .exec()
}

module.exports.consultarPeriodoData = (periodo,data) => {
    return Compositor
        .find({periodo: periodo,dataNasc:{$gte:data}})
        .exec()
}

module.exports.inserir = compositor => {
    return Compositor.create(compositor)
}
