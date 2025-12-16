import { GraphCanvas, type GraphNode } from 'reagraph';
import "./graph-page.css"
import { graphApi } from '../chat-page/api/graph-api';
import { useEffect, useState } from 'react';
import type { GraphData} from '../chat-page/api/graph-dtos';


const GraphPage = () =>{
    const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });

    useEffect(() => {
        graphApi.getGraph().then(data => {
            setGraph(data);
        });
    }, []);

    const handleNodeClick = (node: GraphNode) => {
        console.log('Клик по узлу:', node.label);
    }

    return <div className='graph-container'><GraphCanvas edges={graph.edges} nodes={graph.nodes} onNodeClick={handleNodeClick}></GraphCanvas></div>

}

export default GraphPage