publishDir := docs/
HOST=$(shell hostname)

all: mythaxis #upload invalidate

mythaxis:
	@hugo -F
# 	git add .
# 	git commit -m 'make mythaxis'

upload:
	@echo 'upload'

server:
	-@hugo server -D -F --disableFastRender --bind 0.0.0.0 --baseURL http://$(HOST):1313

clean:
	@rm -rf $(publishDir)