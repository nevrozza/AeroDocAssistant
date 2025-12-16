import json
from pathlib import Path
from functools import lru_cache

# Ruta correcta al root del proyecto
PROJECT_ROOT = Path(__file__).resolve().parents[3]  # .../AeroDocAssistant

GRAPH_INDEX_PATH = PROJECT_ROOT / "data" / "graph_index.json"


@lru_cache(maxsize=1)
def _load_fragment_links() -> dict[str, list[str]]:
    if not GRAPH_INDEX_PATH.exists():
        print("❌ graph_index.json NOT FOUND at:", GRAPH_INDEX_PATH)
        return {}

    with GRAPH_INDEX_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)

    print("✅ Loaded fragment_links:", len(data.get("fragment_links", {})))
    return data.get("fragment_links", {})


def get_related_fragments(frag_id: str) -> list[str]:
    fragment_links = _load_fragment_links()
    print("GRAPH INDEX PATH:", GRAPH_INDEX_PATH.resolve())
    print("frag_id exists?:", frag_id in fragment_links)
    return fragment_links.get(frag_id, [])
