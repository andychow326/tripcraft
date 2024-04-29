.PHONY: setup
setup:
	cp ./public/config.local.js ./public/config.js

.PHONY: codegen
codegen:
	yarn run openapi-generator-cli generate -g typescript-axios -o generated -i http://localhost:8000/openapi.json
