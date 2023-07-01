# Product Detector Demo Application

> **DISCLAIMER**: This is a proof-of-concept application with the aim to demonstrate
> deployment of YOLOv8n model

## Solution overview

Web application allows to detect products (bottles) on shop shelves. This task is commonly called
**Retail Store Item Detection** or **Retail Object Detection** [1], [2].

Web application exposes simple UI that allows a user to Drag&Drop a photo from a shop and get
an image with each identified product (bottle).

Web application is built on top of YOLOv8n model that was delivered by Ultralytics company in 2022.
[Pre-trained version](https://docs.ultralytics.com/models/yolov8/#supported-tasks)
of a model is taken from publicly available storage.

Web application is available as:

* **Web-service** - [http://158.160.28.22/](http://158.160.28.22/)
  (might be not available as it is configured as _interrupted Cloud VM_ - it is
  the cheapest cloud option. Write to monadv@yandex.ru and request to start it again)
* **locally run Docker container** - follow instructions from a corresponding section below.
* **locally run from sources** - follow instructions from a corresponding section below to run it
  from sources.

## Demo

1. Download [image](img/test_7.jpg). This image is taken solely for academic purposes from
   [SKU110K dataset](https://github.com/eg4000/SKU110K_CVPR19). Please do not re-distribute it.
2. Open Web application: [http://158.160.28.22/](http://158.160.28.22/)
3. Select this image:

   ![](img/upload.png)
4. Click **Upload & Run model**
5. Click **Show detections**
6. Inspect results:

   ![](img/result.png)

## Technological stack

Solution is based on:

1. [FastAPI](https://fastapi.tiangolo.com/) - framework for building web applications
   that expose REST API and serve static files
2. [Bootstrap](https://getbootstrap.com/) - library for building responsive UI for web applications
3. [PyTorch](https://pytorch.org/) - framework for designing DL pipelines, training and inference
   of DL models
4. [Ultralytics](https://docs.ultralytics.com/) - library for working with YOLO models
5. [Docker](https://www.docker.com/) - containerizing solution for web applications
6. [Yandex.Cloud](https://cloud.yandex.ru/) - IaaS cloud provider

Code quality is automatically (per each PR/push to main branch) checked with:

1. [GitHub Actions](https://github.com/features/actions) - platform for running automated checks
2. [black](https://pypi.org/project/black/) - library for automatic formatting of code
   according to pre-defined rules
3. [mypy](https://pypi.org/project/mypy/) - library for static type checking
4. [pylint](https://pypi.org/project/pylint/) - library for evaluating code style
   (traditional and well-respected)
5. [ruff](https://pypi.org/project/ruff/) - library for evaluating code style
   (experimental and very hot to this moment)

## Locally run Docker container

Pre-requisites:

* git
* Docker Desktop

Instructions:

1. Clone repo: `git clone https://github.com/demid5111/product-detector`
2. Build image: `docker build -t product-detector .`
3. Run container on top of just built image:
   `docker run -d --name detector-container -p 80:80 product-detector`

## Locally run from sources

Pre-requisites:

* git
* Python 3.9

Instructions:

1. Clone repo: `git clone https://github.com/demid5111/product-detector`
2. `python -m pip install -r requirements.txt`
3. `cd app`
4. `export PYTHONPATH=$(pwd)/..:$PYTHONPATH`
5. `uvicorn main:app --reload`

## Deploy Docker container

Full instruction is in [DEVELOPER.md](./DEVELOPER.md).

[1]: https://blog.roboflow.com/retail-store-item-detection-using-yolov5/

[2]: https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/models/retail_object_detection
