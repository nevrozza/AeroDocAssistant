from pathlib import Path

from app.core import search
from app.core.graph import GraphBuildConfig, build_reference_indexes, save_graph_index
from app.core import config

def main():
    search.setup()

    cfg = GraphBuildConfig(
        k_related=6,
        max_frags_per_doc=80,
        skip_same_document=True,
    )

    payload = build_reference_indexes(cfg)

    out_path = config.DATA_FOLDER / "graph_index.json"
    save_graph_index(payload, out_path)
    print(f"Saved graph index to {out_path}")

if __name__ == "__main__":
    main()
