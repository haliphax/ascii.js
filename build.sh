#!/usr/bin/env bash
PWD=$(pwd)
MYPWD=${BASH_SOURCE[0]%/*}

cd $MYPWD
[ -f ascii.list ] && rm ascii.list

for x in ascii/*/* ; do
	[ ${x#ascii/*.} == "html" ] && continue
	CURR=${x#*ascii/}
	NODIR=${CURR#*/}
	printf "\t\t\t<li><a href='#%s'>%s</a></li>\n" $CURR $NODIR >> ascii.list
done

cat ascii.list | sort -t / -k 2,3 > ascii.list.sorted
mv ascii.list.sorted ascii.list
cat index.top.tmpl ascii.list index.bottom.tmpl > index.html
[ -f ascii.list ] && rm ascii.list
cd $PWD
