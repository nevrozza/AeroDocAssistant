import os

API_KEY = os.getenv("YC_API_KEY")
FOLDER = os.getenv("YC_FOLDER")

if not API_KEY or not FOLDER:
    raise RuntimeError("API_KEY and FOLDER must be set")
