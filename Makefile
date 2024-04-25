.PHONY: vendor
vendor:
	make -C server vendor

.PHONY: setup
setup:
	make -C server setup
