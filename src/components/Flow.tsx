import { useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Sidebar from "./sidebar"
import { initialNodes, loadNodes, nodeTypes, type CustomNodeType } from "./nodes";
import { initialEdges, edgeTypes, type CustomEdgeType, loadEdges } from "./edges";

export default function App() {
  const [nodes, setNodes] = useNodesState<CustomNodeType>(loadNodes());
  const [edges, setEdges] =
    useEdgesState<CustomEdgeType>(loadEdges());
  const [selectedNode, setSelectedNode] = useState<CustomNodeType | null>(null);


  const nodeXPosition = useRef(0);
  const nodeYPosition = useRef(0);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const handleNodeClick = (event: any, node: any) => {
    setSelectedNode(node);
  };

  // NODES CHANGE
  const onNodesChange: OnNodesChange<CustomNodeType> = useCallback(
    (changes) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
    [setNodes],
  );

  // EDGES CHANGE
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edges) => applyEdgeChanges(changes, edges)),
    [setEdges],
  );

  const resetFlow = () => {
    setNodes(initialNodes as any);
    setEdges(initialEdges);
  }

  useEffect(() => {
    localStorage.setItem('nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('edges', JSON.stringify(edges));
  }, [edges]);


  const addNode = useCallback((label: string) => {
    const newNode: CustomNodeType = {
      id: `${nodes.length}`,
      type: 'output',
      position: { x: nodeXPosition.current += 50, y: nodeYPosition.current += 50 },
      data: { label: label || 'Untitled' },
    };
    setNodes((prev) => prev.concat(newNode));
  }, [setNodes]);

  const handleConfigChange = (event: any) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNode!.id) {
          if ('config' in node.data) {
            (node.data as { config: Record<string, string> }).config[event.target.name] = event.target.value;
          } else {
            node.data = {
              ...node.data,
              config: { [event.target.name]: event.target.value }
            };
          }
        }
        return node;
      })
    );
  };


  return (
    <div className="app-container">
      <Sidebar addNode={addNode} edges={edges} nodes={nodes} resetFlow={
        resetFlow
      }>
        {selectedNode && (
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: 10 }}>Configure {selectedNode.data.label}</h3>
            {selectedNode.type === 'data-source' && (
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
            {selectedNode.type === 'transformation' && (
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
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onConnect={onConnect}
        fitView
        colorMode="dark"
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
