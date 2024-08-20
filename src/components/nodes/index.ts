import type { BuiltInNode, Node, NodeTypes } from "@xyflow/react";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "./PositionLoggerNode";

export const initialNodes = [
  {
    id: "a",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "wire" },
  },
  {
    id: "b",
    type: "position-logger",
    position: { x: -100, y: 100 },
    data: { label: "drag me!" },
  },
  { id: "c", position: { x: 100, y: 100 }, data: { label: "your ideas" } },
  {
    id: "d",
    type: "output",
    position: { x: 0, y: 200 },
    data: { label: "with React Flow" },
  },
  {
    id: "1",
    data: { label: "Data Source", config: { api: "" } },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    data: { label: "Transformation", config: { filter: "" } },
    position: { x: 300, y: 100 },
  },
  { id: "3", data: { label: "Output" }, position: { x: 500, y: 100 } },
] satisfies Node[];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
} satisfies NodeTypes;

export const loadNodes = () => {
  const savedNodes = localStorage.getItem("nodes");
  return savedNodes ? JSON.parse(savedNodes) : initialNodes;
};

export type CustomNodeType = BuiltInNode | PositionLoggerNodeType;
