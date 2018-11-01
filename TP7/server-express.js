var http = require('http')
var pug = require('pug')
var fs = require('fs')
var express = require('express')
var formidable = require('formidable')
var logger = require('morgan')
var jsonfile = require('jsonfile')
var myBD = "ficheiros.json"

var app = express()

var regexFile = /\/uploaded\//

app.use(logger("combined"))


app.get('/w3.css',(req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/css'})
    fs.readFile('stylesheet/w3.css',(erro,dados)=>{
        if(!erro) 
            res.write(dados)
        else 
            res.write(pug.renderFile('erro.pug',{e:erro}))
        
        res.end()
    })
})


app.all('*',(req,res,next)=>{
    if( (req.url != 'w3.css') && (!regexFile.test(req.url)) )
        res.writeHead(200,{'Content-Type' : 'text/html; charset=utf-8'})
    next()
})

app.get('/',(req,res)=>{
    res.write(pug.renderFile('form-ficheiro.pug',
    {lista: []}))
    res.end()
})

app.get('/uploaded/*',(req,res)=>{
    jsonfile.readFile( myBD ,(erro,lista)=>{
        var correcaoerro = req.url.split("/")
        if (correcaoerro[3]!="") {
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(pug.renderFile('erro.pug',{e:"Erro: "+req.url+" não está implementado!"}))
            res.end()
        }
        else{
            if(!erro){
            var type ="text/plain"
            for (const x in lista) {
                if (lista[x].path == ("."+req.url) ){
                    type = lista[x].type
                    break
                }
            }
            res.writeHead(200,{'Content-Type':type+';charset=utf-8'})
            fs.readFile( "."+req.url ,(erro2,dados)=>{
                if(!erro){
                    res.write(dados)
                    res.end()
                }
                else{
                    console.log("Erro ler BD!"+ erro2)
                    res.end()
                }
            })
            }
            else{
                console.log("Erro ler BD!"+ erro)
                res.end()
                
            }
        }
    })
})

app.post('/processaForm',(req,res)=>{
    var form = new formidable.IncomingForm()
    form.parse(req,(erro,fields,files)=>{

        var fenviado =  files.ficheiro.path
        var fnovo = './uploaded/'+ files.ficheiro.name
        
        fs.rename(fenviado,fnovo,erro => {
            if(erro){ 
                res.write(pug.renderFile('erro.pug',{e:'Ocorreram erros no armazenamento do ficheiro'}))
            }
            else{
                jsonfile.readFile(myBD,(erro,listaF)=>{
                        if(!erro){
                            var d = new Date();
                            var obj = new Object()
                            obj.name = files.ficheiro.name
                            obj.desc = fields.desc
                            obj.path = fnovo + "/"
                            obj.type = files.ficheiro.type
                            obj.date = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()
                            obj.time =d.getHours()+":"+d.getMinutes()
                            listaF.push(obj)
                            jsonfile.writeFile(myBD,listaF,erro =>{
                                if (erro) console.log(erro)
                                else console.log("Registo guardado com sucesso.")
                            })
                        }
                        else{
                            console.log("Erro ler BD!")
                        }
                        res.end(pug.renderFile('form-ficheiro.pug',{lista:listaF}))
                    
                })
            }
        })
    })
})
app.all('*',(req,res)=>{
    res.write(pug.renderFile('erro.pug',{e:"Erro: "+req.url+" não está implementado!"}))
    res.end()
})

var myServer = http.createServer(app)
myServer.listen(4007,()=>{
    console.log('Servidor á escuta na porta 4007...')
})