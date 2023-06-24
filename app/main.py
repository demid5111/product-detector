import datetime
import uuid
from pathlib import Path

import aiofiles
from fastapi import FastAPI, UploadFile
from starlette import status
from starlette.requests import Request
from starlette.responses import HTMLResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "current_date": datetime.date.today()}
    )


@app.post("/file/upload-file", status_code=status.HTTP_200_OK)
async def upload_image(in_file: UploadFile):
    storage_dir = Path(__file__).parent.parent / "data" / "uploads"
    storage_dir.mkdir(exist_ok=True, parents=True)

    unique_filename = f"{uuid.uuid4()}{Path(in_file.filename).suffix}"
    file_path = storage_dir / unique_filename
    async with aiofiles.open(file_path, "wb") as out_file:
        content = await in_file.read()  # async read
        await out_file.write(content)  # async write

    return {"Result": "OK"}
