#!/usr/bin/env bash
upwd="$(pwd)"
mypwd="${BASH_SOURCE[0]%/*}"

cd "$mypwd"
ascii="$(ls ascii/*/* | sort -f -t / -k 3)"
ascii_html=""

for x in $ascii ; do
	[ "${x#ascii/*.}" == "html" ] && continue
	curr="${x#*ascii/}"
	nodir="${curr#*/}"
	ascii_html="$ascii_html$(printf "<li><a href='#%s'>%s</a></li>" $curr $nodir)"
done

cat index.top.tmpl > index.html
echo "$ascii_html" >> index.html
cat index.bottom.tmpl >> index.html
cd "$upwd"
