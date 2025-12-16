from fastapi import APIRouter
from pydantic import BaseModel


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
    return NodesGraphSchema(
        nodes=[
            Node(id="1", label="first"),
            Node(id="2", label="second"),
            Node(id="3", label="third"),
        ],
        edges=[
            Edge(source="1", target="2", id="1-2", label="1-2"),
            Edge(source="2", target="3", id="2-3", label="2-3"),
            Edge(source="3", target="1", id="3-1", label="3-1"),
        ]
    )
