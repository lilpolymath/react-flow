import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

export type ConditionNodeData = {
  label?: string;
  condition?: string;
};

export type ConditionNode = Node<ConditionNodeData>;

export default function ConditionNode({ data }: NodeProps<ConditionNode>) {
  return (
    <div className="react-flow__node-default" style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
      <strong>Condition Node</strong>
      {data.label && <div>{data.label}</div>}
      {data.condition && <div>Condition: {data.condition}</div>}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
