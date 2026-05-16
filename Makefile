.PHONY: install build dev test lint format typecheck clean docker-up docker-down

install:
	pnpm install

build:
	pnpm run build

dev:
	pnpm run dev

test:
	pnpm run test

lint:
	pnpm run lint

format:
	pnpm run format

typecheck:
	pnpm run typecheck

clean:
	pnpm run clean
	rm -rf node_modules

docker-up:
	docker compose up -d

docker-down:
	docker compose down
