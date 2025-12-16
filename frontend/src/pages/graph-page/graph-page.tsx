import { GraphCanvas } from 'reagraph';
import "./graph-page.css"
import { graphApi } from '../chat-page/api/graph-api';
import { useState } from 'react';
import type { GraphData } from '../chat-page/api/graph-dtos';


const GraphPage = () =>{
    const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });

    graphApi.getGraph().then(data => {setGraph(data)})
    
    return <div className='graph-container'><GraphCanvas edges={graph.edges} nodes={graph.nodes}></GraphCanvas></div>

}

export default GraphPage