import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

export type EndNodeData = {
  label?: string;
};

export type EndNode = Node<EndNodeData, "end-node">;

export default function EndNode({ data }: NodeProps<EndNode>) {
  return (
    <div
      className="react-flow__node-default"
      style={{ padding: 10, backgroundColor: "teal", borderRadius: 5 }}
    >
      <strong>End Node</strong>
      {data.label && <div>{data.label}</div>}
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
