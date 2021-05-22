install:
		npm install
publish:
		npm publish --dry-run
lint:
		npx eslint .
push:
		git push origin
fix:
		npx eslint . --fix