"""
Core RestAPI module
"""

import datetime
import uuid
from pathlib import Path

import aiofiles
from fastapi import FastAPI, UploadFile
from starlette import status
from starlette.requests import Request
from starlette.responses import HTMLResponse, Response
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from app.constants import DATA_DETECTIONS_PATH, DATA_UPLOADS_PATH
from app.yolo.main import infer_yolo_e2e

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """
    Entry API to render starting page
    """
    return templates.TemplateResponse(
        "index.html", {"request": request, "current_date": datetime.date.today()}
    )


@app.post("/file/upload-file", status_code=status.HTTP_200_OK)
async def upload_image(in_file: UploadFile):
    """
    API to upload a file
    """
    DATA_UPLOADS_PATH.mkdir(exist_ok=True, parents=True)

    suffix = Path(in_file.filename or "placeholder.png").suffix
    image_id = uuid.uuid4()
    input_image_path = DATA_UPLOADS_PATH / f"{image_id}{suffix}"
    async with aiofiles.open(input_image_path, "wb") as out_file:
        content = await in_file.read()  # async read
        await out_file.write(content)  # async write

    image_id = uuid.uuid4()
    output_image_path = DATA_DETECTIONS_PATH / f"{image_id}.png"

    DATA_DETECTIONS_PATH.mkdir(exist_ok=True, parents=True)

    print(f"{input_image_path} -> {output_image_path}")

    infer_yolo_e2e(input_image_path, output_image_path)

    return {"image_id": image_id}


@app.get(
    "/file",
    # Set what the media type will be in the autogenerated OpenAPI specification.
    # fastapi.tiangolo.com/advanced/additional-responses/
    responses={200: {"content": {"image/png": {}}}},
    # Prevent FastAPI from adding "application/json" as an additional
    # response media type in the autogenerated OpenAPI specification.
    # https://github.com/tiangolo/fastapi/issues/3258
    response_class=Response,
)
async def get_image(image_id: str):
    """
    API to get a file with predictions
    """

    suffix = ".png"
    unique_filename = f"{image_id}{suffix}"
    file_path = DATA_DETECTIONS_PATH / unique_filename

    async with aiofiles.open(file_path, "rb") as out_file:
        content: bytes = await out_file.read()  # async read

    return Response(content=content, media_type="image/png")
