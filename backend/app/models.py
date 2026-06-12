from pydantic import BaseModel, ConfigDict


class NodeModel(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str


class EdgeModel(BaseModel):
    id: str
    source: str
    target: str


class PipelineParseRequest(BaseModel):
    nodes: list[NodeModel]
    edges: list[EdgeModel]


class PipelineParseResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
