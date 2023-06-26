import uuid
from pathlib import Path

import cv2
from ultralytics import YOLO

from app.constants import DATA_DETECTIONS_PATH, DATA_MODELS_PATH, STATIC_ASSETS_PATH


def infer_yolo_e2e(input_image_path: Path, output_image_path: Path):
    model = YOLO(DATA_MODELS_PATH / "yolov8n.pt")
    results = model(input_image_path)
    annotated_frame = results[0].plot()
    cv2.imwrite(str(output_image_path), annotated_frame)


def main():
    input_image_path = STATIC_ASSETS_PATH / "img" / "bus.jpg"
    output_image_path = DATA_DETECTIONS_PATH / f"{uuid.uuid4()}.png"

    DATA_DETECTIONS_PATH.mkdir(exist_ok=True, parents=True)

    print(f"{input_image_path} -> {output_image_path}")

    infer_yolo_e2e(input_image_path, output_image_path)


if __name__ == "__main__":
    main()
