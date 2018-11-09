var express = require('express');
var router = express.Router();
var formidable = require("formidable")
var fs = require("fs")

var jsonfile = require('jsonfile');

var myBD = __dirname + '/files.json'
/* GET home page. */
router.get('/', (req, res, next)=>  res.render('index'))
router.get('/file',(req,res)=>{
  jsonfile.readFile(myBD,(erro,files)=>{
      if (!erro) res.render('tabela',{tabela:files})  
      else res.render('error',{e:erro}) 
  })
})

router.get('/uploaded/*',(req,res)=>{
          fs.readFile( "."+req.url ,(erro2,dados)=>{
              if(!erro2){
                  res.write(dados)
                  res.end()
              }
              else{
                  console.log("Erro ler BD!"+ erro2)
                  res.end()
              }
          })
        })

router.post('/guardar',(req,res)=>{
  var form = new formidable.IncomingForm()
  form.parse(req,(erro,fields,data)=>{

      var fenviado =  data.file.path
      var fnovo = __dirname + "/../public/uploaded/" + data.file.name
      console.log("\nFNOVO"+fnovo)
      
      fs.rename(fenviado,fnovo,erro => {
          if(erro){ 
              res.write(res.render('error',{e:'Ocorreram erros no armazenamento do ficheiro'}))
          }
          else{
              jsonfile.readFile(myBD,(erro,listaF)=>{
                      if(!erro){
                          var d = new Date();
                          var obj = new Object()
                          obj.name = data.file.name
                          obj.desc = fields.desc
                          obj.path = "http://localhost:4008/uploaded/"+data.file.name
                          obj.type = data.file.type
                          obj.date = fields.date
                          obj.time = fields.time
                          listaF.push(obj)
                          jsonfile.writeFile(myBD,listaF,erro =>{
                              if (erro) console.log(erro)
                              else {
                                console.log("Registo guardado com sucesso.")
                                res.json(data.file.name)
                              }
                          })
                      }
                      else{
                          console.log("Erro ler BD!")
                      }
                      
                  
              })
          }
      })
  })
})
module.exports = router;
