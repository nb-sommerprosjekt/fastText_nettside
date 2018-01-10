#!/bin/bash

if test $# -eq 0 -o $# -eq 2
then
echo " ">/dev/null
else
echo "Illegal number of arguments"
exit
fi


getMyIP() {
    local _ip _line
    while IFS=$': \t' read -a _line ;do
        [ -z "${_line%inet}" ] &&
           _ip=${_line[${#_line[1]}>4?1:2]} &&
           [ "${_ip#127.0.0.1}" ] && echo $_ip && return 0
      done< <(LANG=C /sbin/ifconfig wlp2s0)
}


portBusy() {
	
	cnt=`sudo netstat -tulpn |grep -P ":$1\s"`
	
	if test "${cnt}"  
	then
	  cnt=1
	 else 
	  cnt=0
	fi
	 echo ${cnt}
}

findNextFreePort() {
	PORTNR=$1
	RES=`portBusy ${PORTNR}`
	while test ${RES} -eq 1
	do
	let "PORTNR +=1"
    RES=`portBusy ${PORTNR}`
    done
    echo ${PORTNR}
}


if test $# -eq 2 
then
    MYIP=$1
    MYPORT=$2
    
fi

if test $# -eq 0 
then
    MYIP=`getMyIP` 
    MYPORT=`findNextFreePort 5000`  
   
fi



#netstat -tulpn |grep -P ":6312222\s"
#echo `getMyIP`

#echo `portBusy 63122222`
#echo `findNextFreePort 631`

echo "Classifictaion server config"

sed "s/a.b.c.d/${MYIP}/g" html/scripts/fastText.sktch | sed "s/yyyy/${MYPORT}/g" > html/scripts/fastText.js
sed "s/a.b.c.d/${MYIP}/g" rest.sktch | sed "s/yyyy/${MYPORT}/g" > rest.py
echo "Classification server config finished"
