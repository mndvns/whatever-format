
MOCHA      = ./node_modules/.bin/mocha
MOCHA_OPTS = --watch

test:; @DEBUG=whatever* $(MOCHA) $(MOCHA_OPTS)

.PHONY: test
