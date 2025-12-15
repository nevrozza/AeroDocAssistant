import { GraphCanvas } from 'reagraph';
import "./graph-page.css"


interface GraphPageProps{
    edges: Array<{id: string, target: string, source: string, label: string}>
}

const GraphPage = ({edges}: GraphPageProps) =>{
    const nodes = [
        {id: "1", label: "first"},
        {id: "2", label: "second"},
        {id: "3", label: "third"}
    ]
    
    return <div className='graph-container'><GraphCanvas edges={edges} nodes={nodes}></GraphCanvas></div>

}

export default GraphPage