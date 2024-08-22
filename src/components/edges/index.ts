import type { BuiltInEdge, Edge, EdgeTypes } from "@xyflow/react";

import ButtonEdge, { type ButtonEdge as ButtonEdgeType } from "./ButtonEdge";

export const initialEdges = [
  {
    id: "a->c",
    source: "a",
    target: "c",
    animated: true,
    label: "to the",
    type: "step",
  },
  { id: "b->d", source: "b", target: "d", type: "button-edge" },
  { id: "c->d", source: "c", target: "d", animated: true },
  { id: "1->2", source: "1", target: "2", animated: true },
  { id: "2->3", source: "2", target: "3", animated: true },
] satisfies Edge[];

export const edgeTypes = {
  "button-edge": ButtonEdge,
} satisfies EdgeTypes;

export const loadEdges = () => {
  if (typeof window !== "undefined") {
    const savedEdges = localStorage.getItem("edges");
    return savedEdges ? JSON.parse(savedEdges) : initialEdges;
  }
  return initialEdges;
};

export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;
