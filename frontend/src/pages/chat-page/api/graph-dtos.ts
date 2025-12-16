export interface Node {
  id: string;
  label: string;
}

export interface Edge {
  source: string;
  target: string;
  id: string;
  label: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  // metadata?: {
  //   name?: string;
  //   description?: string;
  //   type?: 'directed' | 'undirected';
  // };
}