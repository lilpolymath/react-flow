import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
  type Edge,
} from "@xyflow/react";

const buttonStyle = {
  width: 20,
  height: 20,
  background: "#1a1a1",
  border: "1px solid #000",
  cursor: "pointer",
  borderRadius: "50%",
  fontSize: "12px",
  lineHeight: 1,
};

type ButtonEdgeData = {};

export type ButtonEdge = Edge<ButtonEdgeData>;

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps<ButtonEdge>) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button style={buttonStyle} onClick={onEdgeClick}>
            x
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
