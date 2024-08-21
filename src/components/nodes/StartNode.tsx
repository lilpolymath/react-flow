import { Box, Card, ContextMenu } from "@radix-ui/themes";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

export type StartNodeData = {
  label?: string;
};

export type StartNode = Node<StartNodeData>;

export default function StartNode({ data }: NodeProps<StartNode>) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Card className="react-flow__node-default" style={{ padding: 10, backgroundColor: 'indigo', borderRadius: 5 }}>
          <strong>Start Node</strong>
          {data.label && <div>{data.label}</div>}
          <Handle type="source" position={Position.Bottom} />
        </Card>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘ ⌫" color="red">
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
