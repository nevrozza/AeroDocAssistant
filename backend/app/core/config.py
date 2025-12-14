import os
from pathlib import Path

API_KEY = os.getenv("YC_API_KEY")
FOLDER = os.getenv("YC_FOLDER")
DATA_FOLDER = Path(os.getenv("DATA_FOLDER"))

if not API_KEY or not FOLDER:
    raise RuntimeError("API_KEY and FOLDER must be set")
