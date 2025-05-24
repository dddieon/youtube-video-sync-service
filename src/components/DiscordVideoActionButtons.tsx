import { JSX } from 'solid-js';

interface Props {
  mode: 'equal' | 'main-only';
  onToggleLayout: () => void;
  onFullscreen: () => void;
}

function MainOnlyIcon() {
  // 큰 사각형 하나(화면용만 보기)
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width={2.3}
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
    </svg>
  );
}
function EqualIcon() {
  // 두 개의 사각형(분할, 기본보기)
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width={2.3}
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <line x1="12" y1="5" x2="12" y2="19" />
    </svg>
  );
}
function FullscreenIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width={2.3}
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="4 4 9 4 9 9" />
      <polyline points="20 4 15 4 15 9" />
      <polyline points="4 20 9 20 9 15" />
      <polyline points="20 20 15 20 15 15" />
    </svg>
  );
}

function IconButton(props: {
  children: JSX.Element;
  onClick?: () => void;
  title?: string;
  bg?: boolean;
}) {
  return (
    <button
      style={{
        background: props.bg ? '#23272aee' : 'none',
        border: 'none',
        'border-radius': props.bg ? '12px' : '8px',
        padding: '10px',
        cursor: 'pointer',
        transition: 'background 0.15s',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'box-shadow': props.bg ? '0 2px 8px 0 #181a1b44' : 'none',
      }}
      class="discord-action-icon-btn"
      onClick={props.onClick}
      title={props.title}
    >
      {props.children}
      <style>{`
        .discord-action-icon-btn svg {
          stroke: #f6f6f7;
          fill: none;
          transition: stroke 0.18s, fill 0.18s;
        }
        .discord-action-icon-btn:hover svg,
        .discord-action-icon-btn:focus svg {
          stroke: var(--theme-accent);
          fill: none;
        }
      `}</style>
    </button>
  );
}

export default function DiscordVideoActionButtons(props: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        right: '14px',
        top: '14px',
        display: 'flex',
        gap: '8px',
        'z-index': 20,
      }}
    >
      {props.mode === 'equal' ? (
        <IconButton title="화면용 영상만 보기" onClick={props.onToggleLayout} bg>
          <MainOnlyIcon />
        </IconButton>
      ) : (
        <IconButton title="기본보기" onClick={props.onToggleLayout} bg>
          <EqualIcon />
        </IconButton>
      )}
      <IconButton title="전체화면" onClick={props.onFullscreen} bg>
        <FullscreenIcon />
      </IconButton>
    </div>
  );
}
