from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import deque

app = FastAPI()

# CRITICAL FIX: Cross-Origin Resource Sharing (CORS) Configuration
# Without these headers, the browser on port 3000 will block all requests to port 8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Data Verification Schemas ---
class NodeModel(BaseModel):
    id: str
    type: str | None = None
    data: Dict[str, Any] = {}

class EdgeModel(BaseModel):
    id: str
    source: str
    target: str

class PipelinePayload(BaseModel):
    nodes: List[NodeModel]
    edges: List[EdgeModel]


def check_is_dag(nodes: List[NodeModel], edges: List[EdgeModel]) -> bool:
    """
    Evaluates graph topology using Kahn's Algorithm (Topological Sort).
    Time Complexity: O(V + E) | Space Complexity: O(V + E)
    Handles isolated graph nodes correctly.
    """
    # 1. Initialize adjacency structures and in-degree dictionaries
    adj: Dict[str, List[str]] = {node.id: [] for node in nodes}
    in_degree: Dict[str, int] = {node.id: 0 for node in nodes}

    # 2. Map structural connections across edge matrices
    for edge in edges:
        # Protect against edges pointing to phantom/invalid nodes
        if edge.source in adj and edge.target in in_degree:
            adj[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    # 3. Seed tracking queue with nodes having an in-degree of 0 (no dependencies)
    # This loop also correctly captures isolated nodes right away
    queue = deque([node_id for node_id in in_degree if in_degree[node_id] == 0])
    processed_count = 0

    # 4. Linearly evaluate layout order processing dependency offsets
    while queue:
        current = queue.popleft()
        processed_count += 1
        
        for neighbor in adj[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If processed node counts match actual canvas node arrays, it's a valid DAG
    return processed_count == len(nodes)


@app.get('/')
def read_root():
    """Health-check operational heartbeat endpoint."""
    return {'Ping': 'Asynchronous Engine Online'}


@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    """
    Receives frontend pipeline canvas state models, validates schemas,
    and returns graph analytics with topological cycle metrics.
    """
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    is_dag = check_is_dag(payload.nodes, payload.edges)

    # CRITICAL: Return keys match VectorShift's requested schema specification exactly
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }