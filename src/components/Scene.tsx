import type { SceneSpec, SceneVehicle } from "@/lib/types";

/**
 * Top-down SVG rendering of a traffic situation (crossroads or t-junction).
 * Right-hand traffic: vehicles enter on the right half of their approach road.
 */

const SIZE = 400;
const C = SIZE / 2;
const HALF_ROAD = 52;
const LANE = 26;

const VEHICLE_COLORS: Record<string, string> = {
  A: "#dc2626",
  B: "#2563eb",
  C: "#16a34a",
  D: "#d97706",
};

type Side = "n" | "e" | "s" | "w";

// Entry position (rear of approach lane) and heading for each side.
const ENTRY: Record<Side, { x: number; y: number; rot: number }> = {
  s: { x: C + LANE, y: SIZE - 55, rot: 0 },
  n: { x: C - LANE, y: 55, rot: 180 },
  e: { x: SIZE - 55, y: C - LANE, rot: 270 },
  w: { x: 55, y: C + LANE, rot: 90 },
};

// Exit lane coordinate (the lane you occupy after leaving in that direction).
const EXIT: Record<Side, { x: number; y: number }> = {
  n: { x: C + LANE, y: 40 },
  s: { x: C - LANE, y: SIZE - 40 },
  e: { x: SIZE - 40, y: C + LANE },
  w: { x: 40, y: C - LANE },
};

const SIGN_POS: Record<Side, { x: number; y: number }> = {
  s: { x: C + HALF_ROAD + 8, y: C + HALF_ROAD + 12 },
  n: { x: C - HALF_ROAD - 44, y: C - HALF_ROAD - 48 },
  e: { x: C + HALF_ROAD + 8, y: C - HALF_ROAD - 48 },
  w: { x: C - HALF_ROAD - 44, y: C + HALF_ROAD + 12 },
};

function vehiclePath(v: SceneVehicle): string {
  const entry = ENTRY[v.from];
  const exit = EXIT[v.to];
  const startX = entry.x + (v.from === "e" ? -30 : v.from === "w" ? 30 : 0);
  const startY = entry.y + (v.from === "s" ? -30 : v.from === "n" ? 30 : 0);
  // Control point: corner of the turn (straight-through degenerates fine).
  const vertical = v.from === "n" || v.from === "s";
  const cx = vertical ? entry.x : exit.x;
  const cy = vertical ? exit.y : entry.y;
  return `M ${startX} ${startY} Q ${cx} ${cy} ${exit.x} ${exit.y}`;
}

function Car({ v }: { v: SceneVehicle }) {
  const { x, y, rot } = ENTRY[v.from];
  const color = VEHICLE_COLORS[v.label] ?? "#525252";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-15} y={-26} width={30} height={52} rx={7} fill={color} stroke="#111827" strokeWidth={1.5} />
      <rect x={-11} y={-16} width={22} height={10} rx={3} fill="#e0f2fe" opacity={0.9} />
      <rect x={-11} y={8} width={22} height={8} rx={3} fill="#e0f2fe" opacity={0.7} />
      <g transform={`rotate(${-rot})`}>
        <circle r={9} fill="#ffffff" stroke={color} strokeWidth={1.5} />
        <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fill="#111827">
          {v.label}
        </text>
      </g>
    </g>
  );
}

function Roads({ spec }: { spec: SceneSpec }) {
  const stem = spec.type === "t-junction" ? (spec.stem ?? "s") : null;
  const showArm = (side: Side) => spec.type === "crossroads" || stem === side || sideOnThroughRoad(side, stem);
  return (
    <g>
      {/* road surfaces */}
      {(showArm("n") || showArm("s")) && (
        <rect
          x={C - HALF_ROAD}
          y={showArm("n") ? 0 : C - HALF_ROAD}
          width={HALF_ROAD * 2}
          height={showArm("n") && showArm("s") ? SIZE : C + HALF_ROAD - (showArm("n") ? 0 : C - HALF_ROAD)}
          fill="#6b7280"
        />
      )}
      {(showArm("e") || showArm("w")) && (
        <rect
          x={showArm("w") ? 0 : C - HALF_ROAD}
          y={C - HALF_ROAD}
          width={showArm("w") && showArm("e") ? SIZE : C + HALF_ROAD - (showArm("w") ? 0 : C - HALF_ROAD)}
          height={HALF_ROAD * 2}
          fill="#6b7280"
        />
      )}
      {/* center lines outside the junction box */}
      {showArm("n") && <line x1={C} y1={0} x2={C} y2={C - HALF_ROAD} stroke="#f9fafb" strokeWidth={3} strokeDasharray="14 12" />}
      {showArm("s") && <line x1={C} y1={C + HALF_ROAD} x2={C} y2={SIZE} stroke="#f9fafb" strokeWidth={3} strokeDasharray="14 12" />}
      {showArm("w") && <line x1={0} y1={C} x2={C - HALF_ROAD} y2={C} stroke="#f9fafb" strokeWidth={3} strokeDasharray="14 12" />}
      {showArm("e") && <line x1={C + HALF_ROAD} y1={C} x2={SIZE} y2={C} stroke="#f9fafb" strokeWidth={3} strokeDasharray="14 12" />}
    </g>
  );
}

function sideOnThroughRoad(side: Side, stem: Side | null): boolean {
  if (!stem) return false;
  const vertical = stem === "n" || stem === "s";
  // Through road is perpendicular to the stem.
  return vertical ? side === "e" || side === "w" : side === "n" || side === "s";
}

export default function Scene({ spec }: { spec: SceneSpec }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-sm mx-auto rounded-xl border border-neutral-300 dark:border-neutral-700"
      role="img"
      aria-label="Traffic situation diagram"
    >
      <defs>
        <marker id="scene-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#111827" />
        </marker>
      </defs>
      <rect width={SIZE} height={SIZE} fill="#d6e3cf" />
      <Roads spec={spec} />
      {spec.vehicles.map((v) => (
        <path
          key={`p-${v.label}`}
          d={vehiclePath(v)}
          fill="none"
          stroke="#111827"
          strokeWidth={3}
          strokeDasharray="7 6"
          markerEnd="url(#scene-arrow)"
          opacity={0.85}
        />
      ))}
      {spec.vehicles.map((v) => (
        <Car key={v.label} v={v} />
      ))}
      {spec.signsFor?.map((s) => (
        <image
          key={`${s.approach}-${s.code}`}
          href={`/signs/${s.code}.svg`}
          x={SIGN_POS[s.approach].x}
          y={SIGN_POS[s.approach].y}
          width={36}
          height={36}
        />
      ))}
    </svg>
  );
}
