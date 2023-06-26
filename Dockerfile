FROM python:3.9

WORKDIR /code

COPY ./requirements_web.txt /code/requirements_web.txt
COPY ./requirements_dl.txt /code/requirements_dl.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements_web.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements_dl.txt

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
