BEGIN {  IGNORECASE = 1; FS = "\""}
/_id/   {id= $4}
/titulo/ {titulo = $4}
END     {print "\"" id "\""  ":::" "\"" titulo "\""}