"""
App constants
"""

from pathlib import Path

STATIC_ASSETS_PATH = Path(__file__).parent / "static"
DATA_PATH = Path(__file__).parent.parent / "data"
DATA_UPLOADS_PATH = DATA_PATH / "uploads"
DATA_MODELS_PATH = DATA_PATH / "models"
DATA_DETECTIONS_PATH = DATA_PATH / "detections"
