# ascii.js

A web-font-based rendering engine for displaying ASCII artwork on the web as text

## Usage

Run the included `build.sh` script to generate the `index.html` file for the gallery.

_Note:_ Currently, PHP is being used in the `build.sh` script as a shortcut for replacing a token in the `index.tmpl` file with the entire contents of the generated artwork list. Alternatives will be added soon.

## File types

Based on the extension of the ASCII file being rendered, ascii.js will decide which font to use. `*.asc` files are rendered using the DOS font, while `*.txt` files are rendered using the Amiga font.

## ANSI support

Currently, the gallery does *not* support ANSI color/control codes.
