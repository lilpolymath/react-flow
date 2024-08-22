import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

export type ActionNodeData = {
  label?: string;
  action?: string;
};

export type ActionNode = Node<ActionNodeData, "action-node">;

export default function ActionNode({ data }: NodeProps<ActionNode>) {
  return (
    <div
      className="react-flow__node-default"
      style={{ padding: 10, backgroundColor: "brown", borderRadius: 5 }}
    >
      <strong>Action Node</strong>
      {data.label && <div>{data.label}</div>}
      {data.action && <div>Action: {data.action}</div>}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
