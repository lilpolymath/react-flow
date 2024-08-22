// @ts-nocheck

import { useStore } from "@/store";
import { nodeTypeMapper } from "@/utils";
import {
  Button,
  Dialog,
  Flex,
  Heading,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState, useEffect } from "react";

interface EditNodeModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const EditNodeModal = ({ isModalOpen, setIsModalOpen }: EditNodeModalProps) => {
  const updateNode = useStore((state) => state.updateNode);
  const selectedNode = useStore((state) => state.selectedNode);

  console.log("selectedNode", selectedNode);

  const [selectedNodeType, setSelectedNodeType] = useState<
    keyof typeof nodeTypeMapper
  >(selectedNode?.type);
  const [nodeLabel, setNodeLabel] = useState(selectedNode?.data.label);
  const [nodeCondition, setNodeCondition] = useState(
    selectedNode.data.condition || ""
  );
  const [nodeAction, setNodeAction] = useState(selectedNode.data.action || "");

  useEffect(() => {
    if (selectedNode) {
      setSelectedNodeType(selectedNode.type);
      setNodeLabel(selectedNode.data.label);
      setNodeCondition(selectedNode.data.condition || "");
      setNodeAction(selectedNode.data.action || "");
    }
  }, [selectedNode, isModalOpen]);

  const handleSaveChanges = () => {
    if (!nodeLabel) {
      alert("Label is required");
      return;
    }

    const updatedNodeData = {
      ...selectedNode,
      selectedNodeType,
      label: nodeLabel,
      condition: nodeCondition,
      action: nodeAction,
    };

    updateNode(selectedNode?.id, updatedNodeData);

    setIsModalOpen(false);
  };

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Content>
        <Heading as="h3" style={{ marginBottom: "24px" }}>
          Edit Node
        </Heading>

        <Flex direction="column" gap="4">
          <label>
            <Text as="div" size="3" mb="1" weight="bold">
              Node Type
            </Text>
            <Select.Root
              value={selectedNodeType}
              onValueChange={setSelectedNodeType}
            >
              <Select.Trigger style={{ width: "100%" }}>
                {nodeTypeMapper[selectedNodeType]}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="start-node">Start Node</Select.Item>
                <Select.Item value="condition-node">Condition Node</Select.Item>
                <Select.Item value="action-node">Action Node</Select.Item>
                <Select.Item value="end-node">End Node</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>

          <label>
            <Text as="div" size="3" mb="1" weight="bold">
              Label
            </Text>
            <TextField.Root
              placeholder="Node Label"
              value={nodeLabel}
              onChange={(e) => setNodeLabel(e.target.value)}
            />
          </label>

          {selectedNodeType === "condition-node" && (
            <label>
              <Text as="div" size="3" mb="1" weight="bold">
                Condition
              </Text>
              <TextField.Root
                placeholder="Condition (e.g., x > 10)"
                value={nodeCondition}
                onChange={(e) => setNodeCondition(e.target.value)}
              />
            </label>
          )}

          {selectedNodeType === "action-node" && (
            <label>
              <Text as="div" size="3" mb="1" weight="bold">
                Action
              </Text>
              <TextField.Root
                placeholder="Action (e.g., Send Email)"
                value={nodeAction}
                onChange={(e) => setNodeAction(e.target.value)}
              />
            </label>
          )}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
          <Button variant="outline" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditNodeModal;
