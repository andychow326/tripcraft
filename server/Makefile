.PHONY: vendor
vendor:
	pip install --upgrade pip setuptools
	pip install poetry==1.8.2
	poetry install

.PHONY: setup
setup:
	cp .env.example .env

.PHONY: create-migration
create-migration:
	docker compose run --rm server poetry run alembic revision -m "$(NAME)"

.PHONY: upgrade-db
upgrade-db:
	docker compose run --rm server poetry run alembic upgrade head

.PHONY: downgrade-db
downgrade-db:
	docker compose run --rm server poetry run alembic downgrade -1
