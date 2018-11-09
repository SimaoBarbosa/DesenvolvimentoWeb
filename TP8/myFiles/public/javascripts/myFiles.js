$(()=>{
    var filename
    var d = new Date();
    var date =d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()
    var time = d.getHours()+":"+d.getMinutes()
    $('#files').load('http://localhost:4008/file')

    $('#adicionar').click(e=>{
        e.preventDefault()
        filename = $("#ficheiro")[0].files[0].name
        $('#files').append("<tr> <td> <a href=\"http://localhost:4008/uploaded/"+filename+"\" " + ">" + filename +"</a> </td>  <td>"+ $('#desc').val() +"</td> <td>"+ date +"</td> <td>"+ time +"</td> </tr>")

        ajaxPost() 
    })

    function ajaxPost(){
        var dados = new FormData()
        dados.append("file",$('#ficheiro')[0].files[0])
        dados.append("desc",$('#desc').val())
        dados.append("date",date)
        dados.append("time",time)

        $.ajax({
            type:"POST",
            enctype: "form/multipart",
            processData: false,
            contentType: false,
            url : "http://localhost:4008/guardar",
            data : dados,    
            success : f => alert("Ficheiro guardado com sucesso: "+ f),
            error : e => {
                alert('Erro no post: ' + e)
                console.log("Erro no post: " +e)
            }        
        })
        $('#desc').val('')
        $('#ficheiro').val('')
    }
})