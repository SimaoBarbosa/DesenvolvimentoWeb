BEGIN {  IGNORECASE = 1; FS = ":::";x=0}
NF==2 {id[x]=$1; tit[x]=$2 ; x++}
END {printResposta();}

function printResposta(){
    print "[\n";
    for (i = 0; i < x; i++){
        if (i+1==x)         print "{\n"   "\t\"id\":"  id[i] ",\n\t\"titulo\":" tit[i] "\n}"  
        else print "{\n"   "\t\"id\":"  id[i] ",\n\t\"titulo\":" tit[i] "\n},"  
        
    }
    print "]";
    
}
