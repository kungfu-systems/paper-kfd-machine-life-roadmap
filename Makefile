.PHONY: check pdf clean

check:
	@test -f paper/main.tex
	@test -f paper/references.bib
	@test "$$(find paper/sections -name '*.tex' -type f | wc -l | tr -d ' ')" -eq 11
	@grep -Fq '\newcommand{\factlabel}' paper/main.tex
	@grep -Fq '\newcommand{\inferencelabel}' paper/main.tex
	@grep -Fq '\newcommand{\hypothesislabel}' paper/main.tex
	@grep -Fq 'buildchain-ref: 9d74fb4557e71992db3516b5ba750d57cb9f3521' .github/workflows/verify.yml
	@grep -Fq "inputs['buildchain-ref'] || 'v3-alpha'" .github/workflows/build.yml
	@grep -Fq "startsWith(github.ref_name, 'alpha/') && 'v3-alpha' || 'v3'" .github/workflows/paper-release.yml
	@git diff --check

pdf:
	mkdir -p _build
	tectonic --outdir _build paper/main.tex

clean:
	rm -rf _build
