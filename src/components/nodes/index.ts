import type { BuiltInNode, Node, NodeTypes } from "@xyflow/react";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "./PositionLoggerNode";
import StartNode, { type StartNode as StartNodeType } from "./StartNode";
import EndNode, { type EndNode as EndNodeType } from "./EndNode";
import ActionNode, { type ActionNode as ActionNodeType } from "./ActionNode";
import ConditionNode, {
  type ConditionNode as ConditionNodeType,
} from "./ConditionNode";

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
    type: "data-source",
    data: { label: "Data Source", config: { api: "" } },
    position: { x: 300, y: 0 },
  },
  {
    id: "2",
    type: "transformation",
    data: { label: "Transformation", config: { filter: "" } },
    position: { x: 300, y: 100 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output" },
    position: { x: 300, y: 200 },
  },
] satisfies Node[];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "start-node": StartNode,
  "end-node": EndNode,
  "action-node": ActionNode,
  "condition-node": ConditionNode,
} satisfies NodeTypes;

export const loadNodes = () => {
  if (typeof window !== "undefined") {
    const savedNodes = localStorage.getItem("nodes");
    return savedNodes ? JSON.parse(savedNodes) : initialNodes;
  }

  return initialNodes;
};

export type CustomNodeType =
  | ConditionNodeType
  | PositionLoggerNodeType
  | StartNodeType
  | EndNodeType
  | ActionNodeType
  | BuiltInNode;
