BEGIN {  IGNORECASE = 1; FS = "\"";x=0}
/_id/   {id[x]= $4;}
/titulo/ {titulo[x] = $4 ; x++;}
END     {
	for(i=0;i<x;i++){	
		 print "\"" id[i] "\""  ":::" "\"" titulo[i] "\"\n"  ;
	}
}