import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import DATA_FOLDER

router = APIRouter()


class Node(BaseModel):
    id: str
    label: str


class Edge(BaseModel):
    source: str
    target: str
    id: str
    label: str


class NodesGraphSchema(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


@router.get("/graph/", response_model=NodesGraphSchema)
def get_graph_nodes() -> NodesGraphSchema:
    try:
        with open(DATA_FOLDER / "graph_index_resolved.json", "r", encoding="utf-8") as file:
            raw_data = json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="graph_index_resolved.json not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON format")

    if "resolved_document_links" not in raw_data:
        raise HTTPException(status_code=500, detail="Invalid graph structure")

    nodes_ids: set[str] = set()
    edges_seen: set[tuple[str, str]] = set()
    edges: list[Edge] = []

    for link in raw_data["resolved_document_links"]:
        try:
            source_id = link["source"]["doc_id"]
            nodes_ids.add(source_id)

            for target in link.get("targets", []):
                target_id = target["doc_id"]
                nodes_ids.add(target_id)

                edge_key = (source_id, target_id)
                if edge_key in edges_seen:
                    continue

                edges_seen.add(edge_key)
                edge_id = f"{source_id}->{target_id}"

                edges.append(
                    Edge(
                        id=edge_id,
                        source=source_id,
                        target=target_id,
                        label=edge_id
                    )
                )

        except KeyError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Invalid link structure, missing field: {e}"
            )

    nodes = [
        Node(id=node_id, label=f"Doc {i}")
        for i, node_id in enumerate(sorted(nodes_ids))
    ]

    return NodesGraphSchema(nodes=nodes, edges=edges)