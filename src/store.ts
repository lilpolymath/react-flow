import { create } from "zustand";

import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import {
  initialNodes,
  loadNodes,
  type CustomNodeType,
} from "./components/nodes";
import { initialEdges, loadEdges } from "./components/edges";

type NodeData = {
  label?: string;
  condition?: string;
  action?: string;
};

type CustomEdgeType = {
  id: string;
  source: string;
  target: string;
};

export type StoreState = {
  nodes: CustomNodeType[];
  edges: CustomEdgeType[];
  selectedNode: CustomNodeType | null;
  setNodes: (nodes: CustomNodeType[]) => void;
  addNode: (nodeData: any) => void;
  updateNode: (nodeId: string, newData: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  setEdges: (edges: CustomEdgeType[]) => void;
  addEdge: (edge: CustomEdgeType) => void;
  selectNode: (node: CustomNodeType) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  reset: () => void;
};

export const useStore = create<StoreState>((set, get) => ({
  nodes: loadNodes(),
  edges: loadEdges(),
  selectedNode: null,
  setNodes: (nodes) => set({ nodes }),
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (nodeData) =>
    set((state) => {
      const newNode = {
        id: `${state.nodes.length + 1}`,
        type: nodeData.selectedNodeType || "",
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        data: {
          label: nodeData.label || "Untitled",
          condition: nodeData.condition || "",
          action: nodeData.action || "",
        },
      };
      return { nodes: [...state.nodes, newNode] };
    }),
  updateNode: (nodeId, newData) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    })),
  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    })),
  duplicateNode: (nodeId) =>
    set((state) => {
      const nodeToDuplicate = state.nodes.find((node) => node.id === nodeId);
      if (!nodeToDuplicate) return { nodes: state.nodes };

      const newNode = {
        ...nodeToDuplicate,
        id: `${state.nodes.length + 1}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
      };

      return { nodes: [...state.nodes, newNode] };
    }),
  setEdges: (edges) => set({ edges }),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  selectNode: (node) => set({ selectedNode: node }),
  reset: () =>
    set({ nodes: initialNodes, edges: initialEdges, selectedNode: null }),
}));
