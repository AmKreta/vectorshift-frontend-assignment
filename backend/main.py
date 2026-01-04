from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Set

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    position: Dict
    data: Dict
    
    class Config:
        extra = "allow"

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str
    targetHandle: str
    
    class Config:
        extra = "allow"

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

def has_cycle(node_id: str, adjacency_list: Dict[str, List[str]], visited: Set[str] = set(), rec_stack: Set[str] = set()) -> bool:
    visited.add(node_id)
    rec_stack.add(node_id)
    
    for neighbor in adjacency_list.get(node_id, []):  # Safe get
        if neighbor not in visited:
            if has_cycle(neighbor, adjacency_list, visited, rec_stack):
                return True
        elif neighbor in rec_stack:
            return True  # Back edge = cycle
    
    rec_stack.remove(node_id)
    return False

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    node_ids = {node.id for node in nodes}
    adjacency_list = {node_id: [] for node_id in node_ids}
    
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            adjacency_list[edge.source].append(edge.target)

    visited = set()
    rec_stack = set()
    
    for node_id in node_ids:
        if node_id not in visited:
            if has_cycle(node_id, adjacency_list, visited, rec_stack):
                return False
    
    return True

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag_result = is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag_result
    }
