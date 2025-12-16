import json
from pathlib import Path

INDEX_PATH = Path("../data/index.json")      # ejecutando desde backend/
GRAPH_PATH = Path("../data/graph_index.json")
OUT_PATH   = Path("../data/graph_index_resolved.json")

def main():
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))

    # index.json schema: {"documents": [{doc_id, filepath, title}, ...]}
    doc_map = {}
    for d in index.get("documents", []):
        doc_map[str(d["doc_id"])] = {
            "doc_id": str(d["doc_id"]),
            "title": d.get("title"),
            "filepath": d.get("filepath"),
        }

    resolved = []
    doc_links = graph.get("document_links", {})

    for src_id, dst_ids in doc_links.items():
        src = doc_map.get(src_id, {"doc_id": src_id, "title": None, "filepath": None})
        dst = [doc_map.get(x, {"doc_id": x, "title": None, "filepath": None}) for x in dst_ids]
        resolved.append({
            "source": src,
            "targets": dst,
            "targets_count": len(dst),
        })

    OUT_PATH.write_text(json.dumps({
        "resolved_document_links": resolved,
        "meta": graph.get("meta"),
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    print("✅ Saved:", OUT_PATH.resolve())

if __name__ == "__main__":
    main()
