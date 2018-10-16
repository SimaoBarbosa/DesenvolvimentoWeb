var http = require('http')
var url = require('url')
var fs = require('fs')
var pug = require('pug')

http.createServer((req,res)=>{
    var ourl = url.parse(req.url)
    var obraUrl = /\/obra\//
    if(ourl.pathname == '/'||ourl.pathname == '/index'){
        res.writeHead(200,{'Content-Type': 'text/html'})
        fs.readFile('./obras-musicais-json/json/index.json','utf-8',(erro,dados) => {
            if (!erro){
                res.write(pug.renderFile('index.pug',{obras:JSON.parse(dados)}))
            }
            else
                res.write('<p><b>Erro: </b> ' + erro + '</p>')
            res.end()
        })
        
    }
    else if(obraUrl.test(ourl.pathname)){
        var ficheiro = ourl.pathname.split('/')[2]
        res.writeHead(200,{'Content-Type': 'text/html'})
        fs.readFile('./obras-musicais-json/json/'+ficheiro + '.json' , (erro,dados) => {
            if (!erro)
                res.write(pug.renderFile('template.pug',{obra:JSON.parse(dados)}))
            else
                res.write('<p><b>Erro: </b> ' + erro + '</p>')
            res.end()
        })
        
    }
    else if(ourl.pathname == '/w3.css') {
        res.writeHead(200,{'Content-Type': 'text/css'})
        fs.readFile('estilo/w3.css', (erro,dados) => {
            if (!erro)
                res.write(dados)
            else
                res.write('<p><b>Erro: </b> ' + erro + '</p>')
            res.end()
        })
    }
    else{
        res.writeHead(200,{'Content-Type': 'text/html'})
        res.write('<p><b>Erro, pedido desconhecido: </b> ' + ourl.pathname + '</p>')
        res.end()
    }

}).listen(5555, ()=>{
    console.log('Servidor á escuta na porta 5555...')
})