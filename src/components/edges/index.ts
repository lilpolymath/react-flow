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
] satisfies Edge[];

export const edgeTypes = {
  "button-edge": ButtonEdge,
} satisfies EdgeTypes;

export const loadEdges = () => {
  const savedEdges = localStorage.getItem("edges");
  return savedEdges ? JSON.parse(savedEdges) : initialEdges;
};

export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;
