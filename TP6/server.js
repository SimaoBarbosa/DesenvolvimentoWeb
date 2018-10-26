var http = require('http')
var url = require('url')
var pug = require('pug')
var fs = require('fs')
var {parse} = require('querystring')
var jsonfile = require('jsonfile')
var myBD = "tarefas.json"
var contador=0
var myServer = http.createServer((req,res)=>{
    var purl = url.parse(req.url,true)
    var query = purl.query
    var regexApagar = /\/apagar\/id/
    var regexW3 = /w3.css/
    console.log('Recebi um pedido: '+purl.pathname)
    console.log('Com a query: ' + JSON.stringify(query))

    if (req.method == 'GET'){
        if(purl.pathname == '/' || purl.pathname == '/index'){
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(pug.renderFile('index.pug'))
            res.end()
        }    
        else if(purl.pathname == '/registo'){
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(pug.renderFile('form-tarefa.pug'))
            res.end()
        }
        else if(purl.pathname == '/lista'){
            jsonfile.readFile(myBD,(erro,tarefas)=>{
                if(!erro){
                    res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
                    res.write(pug.renderFile('lista-tarefas.pug',{lista:tarefas}))
                    res.end()
                }
                else {
                    res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
                    res.write(pug.renderFile('erro.pug',{e:"Erro  na leitura da base de dados"}))
                    res.end()
                }
            })
        }
        else if(regexApagar.test(purl.pathname)){
            console.log("Reconheceu Apagar")
            jsonfile.readFile(myBD,(erro,tarefas)=>{
                recuperaInfo(req,resultado => {     
                    jsonfile.readFile(myBD,(erro,tarefas)=>{
                        if(!erro){
                            apagaTarefa(tarefas,purl.pathname)
                            jsonfile.writeFile(myBD,tarefas,erro =>{
                                if (erro) console.log(erro)
                                else console.log("Registo escondido com sucesso.")
                            })
                        }
                        else{
                            console.log("Erro ler BD!")
                        }
                    })
                })          
                res.writeHead(200,{'Content-Type': 'text/html'})
                res.end(pug.renderFile('index.pug'))
            })
        }
        else if(regexW3.test(purl.pathname)){
            res.writeHead(200,{'Content-Type': 'text/css'})
            fs.readFile('stylesheet/w3.css',(erro,dados)=>{
                if(!erro) 
                    res.write(dados)
                else 
                    res.write(pug.renderFile('erro.pug',{e:erro}))
                
                res.end()
            })
        }
        else{
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(pug.renderFile('erro.pug',{e:"Erro: "+purl.pathname+" não está implementado!"}))
            res.end()
        }
    }
    else if(req.method == 'POST'){
        if(purl.pathname == '/tarefa-recebida'){
            recuperaInfo(req,resultado => {     
                jsonfile.readFile(myBD,(erro,tarefas)=>{
                    if(!erro){
                        size(tarefas)
                        resultado.id=contador
                        tarefas.push(resultado)
                        jsonfile.writeFile(myBD,tarefas,erro =>{
                            if (erro) console.log(erro)
                            else console.log("Registo guardado com sucesso.")
                        })
                    }
                    else{
                        console.log("Erro ler BD!")
                    }
                })
                res.end(pug.renderFile('tarefa-recebida.pug', {tarefa: resultado}))
            })
        }
        else{
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.write(pug.renderFile('erro.pug',{e:"Erro: "+purl.pathname+" não está implementado!"}))
            res.end()
        }
    }
    
    else{
        res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
        res.write(pug.renderFile('erro.pug',{e:"Método: " + req.method + " não suportado!"}))
        res.end()
    }


})

myServer.listen(4006,()=>{
    console.log('Servidor á escuta na porta 4006...')
})

function recuperaInfo(request, callback){
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded'){
        let body=''
        request.on('data',bloco => {
            body += bloco.toString()
        })
        request.on('end',()=>{
            callback(parse(body))
        })
    }
    else callback(null)
}
function size(tarefas){
    contador=0
    for (x in tarefas)
        contador++
}
function apagaTarefa(tarefas,pathname) {
    var idString = pathname.split("_")
    var id = idString[1]
    for (x in tarefas) {
        if (tarefas[x].id==id){
            tarefas[x].visivel="no"
        }
    }
}