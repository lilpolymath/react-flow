// @ts-nocheck
import { useCallback, useEffect, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Sidebar from "./sidebar"
import { initialNodes, loadNodes, nodeTypes, type CustomNodeType } from "./nodes";
import { initialEdges, edgeTypes, type CustomEdgeType, loadEdges } from "./edges";

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>(loadNodes());
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<CustomEdgeType>(loadEdges());
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  useEffect(() => {
    localStorage.setItem('nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('edges', JSON.stringify(edges));
  }, [edges]);

  const addNode = useCallback((title: string, description: string) => {
    const newNode = {
      id: v4(),
      type: 'node',
      position: { x: nodeXPosition.current += 50, y: nodeYPosition.current += 50 },
      data: { title: title || 'Untitled', description: description || 'No description' },
      className: 'bg-zinc-900 rounded-[1rem]',
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const handleConfigChange = (event) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          node.data.config[event.target.name] = event.target.value;
        }
        return node;
      })
    );
  };

  return (
    <div className="app-container">
      <Sidebar>
        {selectedNode && (
          <div style={{ padding: '16px 0' }}>
            <h3>Configure {selectedNode.data.label}</h3>
            {selectedNode.data.label === 'Data Source' && (
              <div>
                <label>
                  API Endpoint:
                  <input
                    type="text"
                    name="api"
                    value={selectedNode.data.config.api}
                    onChange={handleConfigChange}
                  />
                </label>
              </div>
            )}
            {selectedNode.data.label === 'Transformation' && (
              <div>
                <label>
                  Filter Criteria:
                  <input
                    type="text"
                    name="filter"
                    value={selectedNode.data.config.filter}
                    onChange={handleConfigChange}
                  />
                </label>
              </div>
            )}
          </div>
        )}
      </Sidebar>
      <ReactFlow<CustomNodeType, CustomEdgeType>
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
