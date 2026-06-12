from collections import deque

from app.models import EdgeModel, NodeModel


def check_is_dag(nodes: list[NodeModel], edges: list[EdgeModel]) -> bool:
    """Return True when the pipeline graph has no cycles."""
    adjacency: dict[str, list[str]] = {node.id: [] for node in nodes}
    in_degree: dict[str, int] = {node.id: 0 for node in nodes}

    for edge in edges:
        if edge.source in adjacency and edge.target in in_degree:
            adjacency[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    queue = deque(node_id for node_id, degree in in_degree.items() if degree == 0)
    processed_count = 0

    while queue:
        current = queue.popleft()
        processed_count += 1

        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return processed_count == len(nodes)
