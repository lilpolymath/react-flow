import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";
import { Button, Dialog, Flex, Heading, Select, Text, TextField } from '@radix-ui/themes';

import "@xyflow/react/dist/style.css";

import Sidebar from "./sidebar"
import { initialNodes, loadNodes, nodeTypes, type CustomNodeType } from "./nodes";
import { initialEdges, edgeTypes, type CustomEdgeType, loadEdges } from "./edges";

const nodeTypeMapper: Record<string, string> = {
  'start-node': 'Start Node',
  'condition-node': 'Condition Node',
  'action-node': 'Action Node',
  'end-node': 'End Node',
  'transformation': 'Transformation',
  'data-source': 'Data Source',
  'filter': 'Filter',
};

export default function App() {
  const [nodes, setNodes] = useNodesState<CustomNodeType>(loadNodes());
  const [edges, setEdges] =
    useEdgesState<CustomEdgeType>(loadEdges());
  const [selectedNode, setSelectedNode] = useState<CustomNodeType | null>(null);

  const nodeXPosition = useRef(0);
  const nodeYPosition = useRef(0);

  const [selectedNodeType, setSelectedNodeType] = useState<keyof typeof nodeTypeMapper>('start-node');
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeCondition, setNodeCondition] = useState('');
  const [nodeAction, setNodeAction] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('edges', JSON.stringify(edges));
  }, [edges]);

  const handleAddNode = () => {
    const nodeData = {
      selectedNodeType,
      label: nodeLabel,
      condition: nodeCondition,
      action: nodeAction,
    };

    addNode(nodeData);

    setSelectedNodeType('startNode');
    setNodeLabel('');
    setNodeCondition('');
    setNodeAction('');

    setIsModalOpen(false);
  };

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const handleNodeClick = (event: any, node: CustomNodeType) => {
    setSelectedNode(node);
  };

  const onNodesChange: OnNodesChange<CustomNodeType> = useCallback(
    (changes) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edges) => applyEdgeChanges(changes, edges)),
    [setEdges],
  );

  const resetFlow = () => {
    setNodes(initialNodes as any);
    setEdges(initialEdges);
  }

  const addNode = useCallback((nodeData: any) => {
    const { selectedNodeType = 'output', label, condition = '', action = '' } = nodeData;

    const newNode = {
      id: `${nodes.length + 1}`,
      type: selectedNodeType,
      position: {
        x: nodeXPosition.current += 50,
        y: nodeYPosition.current += 50
      },
      data: {
        label: label || 'Untitled',
        condition,
        action
      },
    };

    setNodes((prev) => prev.concat(newNode));
  }, [nodes, selectedNodeType, nodeLabel, nodeCondition, nodeAction]);

  const handleEditNode = useCallback((id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      setSelectedNode(node);
      setSelectedNodeType(node.type as keyof typeof nodeTypeMapper);
      setNodeLabel(node.data.label || '');
      setNodeCondition(node.data.condition || '');
      setNodeAction(node.data.action || '');
      setIsModalOpen(true);
    }
  }, [nodes]);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((nodes) => nodes.filter(node => node.id !== id));
  }, [setNodes]);

  const handleDuplicateNode = useCallback((id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      const newNode = {
        ...node,
        id: `${nodes.length + 1}`,
        position: {
          x: nodeXPosition.current += 50,
          y: nodeYPosition.current += 50
        }
      };
      setNodes((nodes) => nodes.concat(newNode));
    }
  }, [nodes, setNodes]);


  const handleConfigChange = (event: any) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNode!.id) {
          if ('config' in node.data) {
            (node.data as { config: Record<string, string> }).config[event.target.name] = event.target.value;
          } else {
            node.data = {
              ...node.data,
              config: { [event.target.name]: event.target.value }
            };
          }
        }
        return node;
      })
    );
  };

  return (
    <div className="app-container">
      <Sidebar addNode={addNode} edges={edges} nodes={nodes} resetFlow={
        resetFlow
      }>
        <Button onClick={() => setIsModalOpen(true)} style={{
          width: "100%",
          marginTop: "20px"
        }} >Create Custom Node</Button>

        <AddNodeModal {...({ isModalOpen, setIsModalOpen, selectedNodeType, setSelectedNodeType, nodeLabel, setNodeLabel, nodeCondition, setNodeCondition, nodeAction, setNodeAction, handleAddNode })} />


        <Button color='red' style={{
          width: "100%",
        }} mt='4' onClick={() => resetFlow()}>Reset Board</Button>
      </Sidebar>

      {/* {selectedNode && (
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: 10 }}>Configure {selectedNode.data.label}</h3>
            {selectedNode.type === 'data-source' && (
              <div>
                <label>
                  API Endpoint:
                  <input
                    type="text"
                    name="api"
                    value={selectedNode.data.config.api}
                    onChange={handleConfigChange}
                  />
                </label>
              </div>
            )}
            {selectedNode.type === 'transformation' && (
              <div>
                <label>
                  Filter Criteria:
                  <input
                    type="text"
                    name="filter"
                    value={selectedNode.data.config.filter}
                    onChange={handleConfigChange}
                  />
                </label>
              </div>
            )}
          </div>
        )} */}

      <ReactFlow<CustomNodeType, CustomEdgeType>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onConnect={onConnect}
        fitView
        colorMode="dark"
      >
        <Background />
        <MiniMap nodeColor={(node) => {
          switch (node.type) {
            case 'start-node': return 'indigo';
            case 'condition-node': return 'blue';
            case 'action-node': return 'brown';
            case 'end-node': return 'teal';
            default: return '#00FF6D';
          }
        }} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

interface AddNodeModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedNodeType: string;
  setSelectedNodeType: (value: string) => void;
  nodeLabel: string;
  setNodeLabel: (value: string) => void;
  nodeCondition: string;
  setNodeCondition: (value: string) => void;
  nodeAction: string;
  setNodeAction: (value: string) => void;
  handleAddNode: () => void;
}

function AddNodeModal({
  isModalOpen,
  setIsModalOpen,
  selectedNodeType,
  setSelectedNodeType,
  nodeLabel,
  setNodeLabel,
  nodeCondition,
  setNodeCondition,
  nodeAction,
  setNodeAction,
  handleAddNode
}: AddNodeModalProps) {
  return <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
    <Dialog.Content>
      <Heading as="h3" style={{
        marginBottom: "24px"
      }}>Add Custom Node</Heading>

      <Flex direction={'column'} gap="4">
        <label>
          <Text as="div" size="3" mb="1" weight="bold">
            Node Type
          </Text>
          <Select.Root value={selectedNodeType} onValueChange={setSelectedNodeType}>
            <Select.Trigger style={{
              width: "100%",
            }}>{nodeTypeMapper[selectedNodeType]}</Select.Trigger>
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
          <TextField.Root placeholder="Node Label" value={nodeLabel} onChange={(e) => setNodeLabel(e.target.value)} />
        </label>

        {selectedNodeType === 'condition-node' && (
          <label>
            <Text as="div" size="3" mb="1" weight="bold">
              Condition
            </Text>
            <TextField.Root placeholder="Condition (e.g., x > 10)" value={nodeCondition} onChange={(e) => setNodeCondition(e.target.value)} />
          </label>
        )}

        {selectedNodeType === 'action-node' && (
          <label>
            <Text as="div" size="3" mb="1" weight="bold">
              Action
            </Text>
            <TextField.Root placeholder="Action (e.g., Send Email)" value={nodeAction} onChange={(e) => setNodeAction(e.target.value)} />
          </label>
        )}
      </Flex>

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close><Button variant="soft" color="gray">Close</Button></Dialog.Close>
        <Button variant="outline" onClick={handleAddNode}>Add Node</Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>;
}

