# product-detector

## Setup

1. `python -m pip install -r requirements.txt`
2. `cd app`
3. `export PYTHONPATH=$(pwd)/..:$PYTHONPATH`
2. `uvicorn main:app --reload`

## Docker

1. `docker build -t product-detector .`, add `--progress=plain` if needed
2. `docker run -d --name detector-container -p 80:80 product-detector`

## Links

1. [Dataset](https://drive.google.com/file/d/1iq93lCdhaPUN0fWbLieMtzfB1850pKwd/edit)

## Formatting

1. `black app -v`
