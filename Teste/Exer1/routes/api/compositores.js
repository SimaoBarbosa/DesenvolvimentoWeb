var express = require('express')
var router = express.Router()
var Compositor = require('../../controllers/api/compositor')

// API para os compositores

router.get('/', (req,res)=>{
    console.log(req.query);
    
    if (req.query.periodo && req.query.data){
        console.log("Consultar por periodo e data");
        Compositor.consultarPeriodoData(req.query.periodo,req.query.data)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na listagem de compositores por periodo e data.'))
    }
    else if (req.query.periodo){
        console.log("Consultar por periodo");
        Compositor.consultarPeriodo(req.query.periodo)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na listagem de compositores por periodo.'))
    }
    else{
        console.log("Consultar tudo");
        Compositor.listar()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na listagem de compositores.'))
    }
})

router.get('/:id', (req,res)=>{
        console.log("Consultar por id");
        Compositor.consultar(req.params.id)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na consulta de compositor.'))
})

module.exports = router



