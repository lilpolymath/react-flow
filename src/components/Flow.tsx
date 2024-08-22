import { Button } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Sidebar from "./sidebar";
import AddNodeModal from "./modals/AddNodeModal";

import { StoreState, useStore } from "@/store";

import { nodeTypes, type CustomNodeType } from "./nodes";
import { edgeTypes, type CustomEdgeType } from "./edges";

const selector = (state: StoreState) => ({
  nodes: state.nodes,
  edges: state.edges,
  selectedNode: state.selectedNode,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  addNode: state.addNode,
  updateNode: state.updateNode,
  deleteNode: state.deleteNode,
  duplicateNode: state.duplicateNode,
  selectNode: state.selectNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  reset: state.reset,
});

export default function App() {
  const {
    nodes,
    edges,
    selectedNode,
    addNode,
    updateNode,
    onEdgesChange,
    onNodesChange,
    selectNode,
    onConnect,
    reset,
  } = useStore(useShallow(selector));

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNodeClick = (_: any, node: CustomNodeType) => {
    selectNode(node);
  };

  const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNode) {
      const { name, value } = event.target;
      updateNode(selectedNode.id, { ...selectedNode.data, [name]: value });
    }
  };

  return (
    <div className="app-container">
      <Sidebar>
        <Button
          onClick={() => setIsModalOpen(true)}
          style={{
            width: "100%",
            marginTop: "20px",
          }}
        >
          Create Custom Node
        </Button>

        <AddNodeModal
          {...{
            isModalOpen,
            setIsModalOpen,
          }}
        />

        <Button
          color="red"
          style={{
            width: "100%",
          }}
          mt="4"
          onClick={() => reset()}
        >
          Reset Board
        </Button>
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
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "start-node":
                return "indigo";
              case "condition-node":
                return "blue";
              case "action-node":
                return "brown";
              case "end-node":
                return "teal";
              default:
                return "#00FF6D";
            }
          }}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}
