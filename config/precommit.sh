set -x

black app -v

mypy app

pylint app

ruff app
