# Contributing instructions

## Deploying Docker image as a service to Yandex.Cloud

### Stage 1. Publish Docker image in Yandex.Cloud registry

1. Install [Yandex.Cloud CLI][1]
2. Build Docker image with application. Follow instructions from [README.md](./README.md)
3. Ensure image is built and ready: `docker image list`
4. Initialize Yandex.Cloud CLI: `yc init`
5. Login to Yandex.Cloud: `docker login --username oauth --password TOKEN cr.yandex`
6. Create Docker registry via
   UI: [link](https://cloud.yandex.ru/docs/container-registry/operations/registry/registry-create)
7. Tag local image due to **required** template:
   `docker tag product-detector cr.yandex/crpt6e6sd4fcg2honqpg/product-detector:hello`
8. Push Docker image to Yandex.Cloud registry:
   `docker push cr.yandex/crpt6e6sd4fcg2honqpg/product-detector:hello`
9. Verify it is uploaded: `yc container image list`

### Stage 2. Create VM in Yandex.Cloud

Ordinary creation of VM, preferred option is as a **Container Solution**.
Example [instructions][2].

### Stage 3. Setup VM and run Docker container

1. Enter machine: `ssh -i ~/.ssh/PRIVATE_KEY USER@IP`
2. Install [Yandex.Cloud CLI][1]
3. Activate shell without restart: `source "/home/demidovs/.bashrc"`
4. Initialize Yandex.Cloud CLI: `yc init`
5. Verify necessary image is uploaded: `yc container image list`
6. Configure Yandex.Cloud CLI: `yc container registry configure-docker`
7. Pull needed Docker image: `docker pull cr.yandex/crpt6e6sd4fcg2honqpg/product-detector:hello`
8. Run application as a container:
   `docker run -d --name detector-container -p 80:80 cr.yandex/crpt6e6sd4fcg2honqpg/product-detector:hello`

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

[1]: https://cloud.yandex.ru/docs/cli/quickstart#install

[2]: https://green-api.com/docs/sdk/python/pythonWebhookServer/serverDockerOnYandexCloud/
