from fastapi import APIRouter

from app.models import PipelineParseRequest, PipelineParseResponse
from app.services.dag import check_is_dag

router = APIRouter()


@router.post("/pipelines/parse", response_model=PipelineParseResponse)
def analyze_pipeline(payload: PipelineParseRequest) -> PipelineParseResponse:
    return PipelineParseResponse(
        num_nodes=len(payload.nodes),
        num_edges=len(payload.edges),
        is_dag=check_is_dag(payload.nodes, payload.edges),
    )
