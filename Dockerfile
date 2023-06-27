FROM python:3.9

WORKDIR /code/app

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

ENV PYTHONPATH=/code:$PYTHONPATH

COPY ./requirements_web.txt /code/requirements_web.txt
COPY ./requirements_dl.txt /code/requirements_dl.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements_web.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements_dl.txt

COPY ./app /code/app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
