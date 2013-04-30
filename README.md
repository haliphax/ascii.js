# ascii.js

A web-font-based rendering engine for displaying ASCII artwork on the web as text

## Usage

Run the included `build.sh` script to generate the `index.html` file for the gallery.

## File types

Based on the extension of the ASCII file being rendered, ascii.js will decide which font to use. `*.asc` files are rendered using the DOS font, while `*.txt` files are rendered using the Amiga font.

## ANSI support

Currently, the gallery does *not* support ANSI color/control codes.
