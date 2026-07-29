.PHONY: check pdf clean

check:
	@test -f paper/main.tex
	@test -f paper/references.bib
	@test "$$(find paper/sections -name '*.tex' -type f | wc -l | tr -d ' ')" -eq 11
	@rg -Fq '\newcommand{\factlabel}' paper/main.tex
	@rg -Fq '\newcommand{\inferencelabel}' paper/main.tex
	@rg -Fq '\newcommand{\hypothesislabel}' paper/main.tex
	@git diff --check

pdf:
	mkdir -p _build
	tectonic --outdir _build paper/main.tex

clean:
	rm -rf _build
