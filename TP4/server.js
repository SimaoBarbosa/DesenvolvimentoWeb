var http = require('http')
var fs = require('fs')
var url = require('url')
http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/html'})
    var myObj = url.parse(req.url, true)
    var r = ""
    if (myObj.pathname.trim() === "/"  ) var r = "/index.html"
    else var r = myObj.pathname
    fs.readFile('./website'+r, (erro,dados)=>{
        if(!erro) 
            res.write(dados)
        else
            res.write('<p><b>ERRO:</b>' + erro + '</p>')
        res.end()
    })
}).listen(5005, ()=>{
    console.log('Servidor á escuta na porta 5005...')
})
