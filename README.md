# ascii.js

A web-font-based rendering engine for displaying ASCII artwork on the web as text

## Usage

Run the included `build.sh` script to generate the `index.html` file for the gallery.

**Note:** Currently, PHP is being used in the `build.sh` script as a shortcut for replacing a token in the `index.tmpl` file with the entire contents of the generated artwork list. Alternatives will be added soon.

## Different fonts

Based on the parent folder of the ASCII file being rendered, ascii.js will decide which font to use.

* `80x50/` - These files will be rendered with the 80x50 DOS font
* `dos/` - These files will be rendered with the 80x25 DOS font
* `amiga/` - These files will be rendered with the Amiga Topaz 500 font

## ANSI support

Currently, the gallery does *not* support ANSI color/control codes.
