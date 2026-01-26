export interface GraphNode {
  id: string;
  label: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  id: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  // metadata?: {
  //   name?: string;
  //   description?: string;
  //   type?: 'directed' | 'undirected';
  // };
}