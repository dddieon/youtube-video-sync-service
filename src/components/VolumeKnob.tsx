import { JSX } from 'solid-js';

interface VolumeKnobProps {
  value: number; // 0~100
  onChange: (v: number) => void;
}

// 각도 계산: 135deg(왼쪽 아래) ~ 405deg(오른쪽 아래) 총 270도
const MIN_ANGLE = 135;
const MAX_ANGLE = 405;
const ANGLE_RANGE = MAX_ANGLE - MIN_ANGLE;
const TICK_COUNT = 40;
const COLOR_ACTIVE = '#b9aaff'; // 디스코드 연보라
const COLOR_INACTIVE = '#444851';
const KNOB_BG = '#2f3136';
const POINTER_COLOR = '#ff4fa3';

function lerpColor(a: string, b: string, t: number) {
  // hex to rgb
  const ah = a.replace('#', '');
  const bh = b.replace('#', '');
  const ar = parseInt(ah.substring(0, 2), 16),
    ag = parseInt(ah.substring(2, 4), 16),
    ab = parseInt(ah.substring(4, 6), 16);
  const br = parseInt(bh.substring(0, 2), 16),
    bg = parseInt(bh.substring(2, 4), 16),
    bb = parseInt(bh.substring(4, 6), 16);
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `rgb(${rr},${rg},${rb})`;
}

export default function VolumeKnob(props: VolumeKnobProps): JSX.Element {
  // 값(0~100)을 각도로 변환
  const angle = MIN_ANGLE + (ANGLE_RANGE * props.value) / 100;
  const centerX = 48;
  const centerY = 48;
  const pointerR = 32;
  const knobR = 28;

  // 드래그로 값 조절
  function handleDrag(e: MouseEvent | TouchEvent) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const dx = x - (rect.left + rect.width / 2);
    const dy = y - (rect.top + rect.height / 2);
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    deg = deg < 0 ? deg + 360 : deg;
    let v = ((deg - MIN_ANGLE + 360) % 360) / ANGLE_RANGE;
    v = Math.max(0, Math.min(1, v));
    props.onChange(Math.round(v * 100));
  }

  function startDrag(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    function move(ev: MouseEvent | TouchEvent) {
      handleDrag(ev);
    }
    function up() {
      window.removeEventListener('mousemove', move as any);
      window.removeEventListener('touchmove', move as any);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    }
    window.addEventListener('mousemove', move as any);
    window.addEventListener('touchmove', move as any);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    handleDrag(e);
  }

  // 눈금(틱) SVG path 생성
  const ticks = [];
  for (let i = 0; i < TICK_COUNT; i++) {
    const tickAngle = MIN_ANGLE + (ANGLE_RANGE * i) / (TICK_COUNT - 1);
    const rad = (tickAngle * Math.PI) / 180;
    const r1 = 38,
      r2 = 44;
    const x1 = centerX + r1 * Math.cos(rad);
    const y1 = centerY + r1 * Math.sin(rad);
    const x2 = centerX + r2 * Math.cos(rad);
    const y2 = centerY + r2 * Math.sin(rad);
    const t = i / (TICK_COUNT - 1);
    const isActive = t <= props.value / 100;
    ticks.push(
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isActive ? COLOR_ACTIVE : COLOR_INACTIVE}
        strokeWidth={2.2}
        opacity={isActive ? 1 : 0.5}
        strokeLinecap="round"
      />,
    );
  }

  // 포인터 점(항상 위쪽, 그룹 rotate)
  const pointerX = centerX;
  const pointerY = centerY - pointerR;

  return (
    <div
      style={{
        width: '110px',
        height: '120px',
        display: 'inline-block',
        cursor: 'pointer',
        position: 'relative',
        'user-select': 'none',
        background: 'none',
      }}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      title="볼륨 조절"
    >
      <svg
        width="110"
        height="110"
        viewBox="0 0 96 96"
        style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}
      >
        {/* 바깥 눈금(틱) */}
        <g>{ticks}</g>
        {/* 중앙 원판 + 포인터 점 그룹 (회전) */}
        <g
          style={{
            transform: `rotate(${angle - MIN_ANGLE}deg)`,
            'transform-origin': `${centerX}px ${centerY}px`,
          }}
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={knobR}
            fill={KNOB_BG}
            stroke="#23272a"
            strokeWidth="2.5"
          />
          {/* 포인터 점 (항상 위쪽, 그룹 rotate) */}
          <circle
            cx={pointerX}
            cy={pointerY}
            r="6"
            fill={POINTER_COLOR}
            stroke="#fff"
            strokeWidth="2.5"
            filter="drop-shadow(0 0 6px #ff4fa3)"
          />
        </g>
        {/* MIN/MAX 텍스트 */}
        <text
          x={centerX - 30}
          y={centerY + 38}
          fontSize="1.05em"
          fill={COLOR_INACTIVE}
          fontWeight="bold"
          textAnchor="middle"
        >
          MIN
        </text>
        <text
          x={centerX + 30}
          y={centerY + 38}
          fontSize="1.05em"
          fill={COLOR_INACTIVE}
          fontWeight="bold"
          textAnchor="middle"
        >
          MAX
        </text>
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: '62%',
          'text-align': 'center',
          'pointer-events': 'none',
        }}
      >
        <div
          style={{
            color: COLOR_ACTIVE,
            'font-weight': 800,
            'font-size': '1.08em',
            'letter-spacing': '0.04em',
            'text-shadow': '0 1px 4px #23272a, 0 0 2px #000',
            'margin-bottom': '-2px',
          }}
        >
          VOLUME
        </div>
        <div
          style={{
            color: '#fff',
            'font-weight': 900,
            'font-size': '1.7em',
            'text-shadow': '0 1px 4px #23272a, 0 0 2px #000',
          }}
        >
          {props.value}%
        </div>
      </div>
    </div>
  );
}
