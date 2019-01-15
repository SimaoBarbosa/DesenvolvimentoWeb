var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res) {
  var nivel = 1
  axios.get('http://clav-test.di.uminho.pt/api/classes/nivel/1')
    .then(resposta=> res.render('index', { classes: resposta.data, nivel:nivel, desc:"" }))
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro ao carregar a lista de classes nivel 1"})
    })
});


router.get('/codigo', function(req, res) {
  if (!req.query.codigo) res.render('error', {message: "Erro ao carregar a lista por codigo"})
  var nivel = req.query.codigo.split('.').length +1
  console.log("Nivel:"+nivel);
  axios.get('http://clav-test.di.uminho.pt/api/classes/c' + req.query.codigo)
  .then(respostaDesc=> axios.get('http://clav-test.di.uminho.pt/api/classes/c' + req.query.codigo + '/descendencia')
                        .then(resposta=> {
                          res.render('index', { classes: resposta.data, nivel:nivel ,codigo: req.query.codigo , desc: respostaDesc.data})
                        })
                        .catch(erro => {
                          console.log('Erro ao carregar classe.')
                          res.render('error', {error: erro, message: "Erro ao carregar classe da BD."})
                        }))
  .catch(erro => {
    console.log('Erro ao carregar classe.')
    res.render('error', {error: erro, message: "Erro ao carregar classe da BD."})
  })
});
module.exports = router;
