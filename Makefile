.PHONY: opencode

opencode:
	mkdir -p ~/.config/opencode
	rsync -a --ignore-existing .opencode/ ~/.config/opencode/