#!/usr/bin/env bash
MYPWD=${BASH_SOURCE[0]%/*}

[ -f $MYPWD/ascii.list ] && rm $MYPWD/ascii.list

for x in $MYPWD/ascii/*.{asc,txt} ; do
	CURR=${x#*ascii/}
	printf "\t\t\t<li><a href='#%s'>%s</a></li>\n" $CURR $CURR >> $MYPWD/ascii.list
done

/usr/bin/env php -r "echo str_replace('<!-- list -->', file_get_contents('${MYPWD}/ascii.list'), file_get_contents('${MYPWD}/index.tmpl'));" > $MYPWD/index.html

[ -f $MYPWD/ascii.list ] && rm $MYPWD/ascii.list
