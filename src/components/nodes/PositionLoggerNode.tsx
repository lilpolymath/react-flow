import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

export type PositionLoggerNodeData = {
  config: any;
  label?: string;
};

export type PositionLoggerNode = Node<PositionLoggerNodeData>;

export default function PositionLoggerNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PositionLoggerNode>) {
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;

  return (
    <div className="react-flow__node-default">
      {data.label && <div>{data.label}</div>}

      <div>
        {x} {y}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
