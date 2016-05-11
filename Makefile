
MOCHA      = ./node_modules/.bin/mocha
MOCHA_OPTS = --watch

test:; @DEBUG=whatever-format:none $(MOCHA) $(MOCHA_OPTS)

.PHONY: test
