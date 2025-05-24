import { JSX, Show } from 'solid-js';

export default function HelpModal(props: {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}) {
  return (
    <Show when={props.open}>
      <div
        style={{
          position: 'fixed',
          right: '90px',
          bottom: '150px',
          width: '340px',
          'max-height': '60vh',
          background: 'var(--theme-card)',
          'border-radius': '18px',
          'box-shadow': '0 8px 32px 0 #181a1b66',
          'z-index': 101,
          display: 'flex',
          'flex-direction': 'column',
          overflow: 'hidden',
          animation: 'modalFadeIn 0.2s ease-out',
        }}
      >
        <button
          style={{
            'align-self': 'flex-end',
            background: 'none',
            border: 'none',
            color: 'var(--theme-text-muted)',
            'font-size': '1.7em',
            'font-weight': 900,
            cursor: 'pointer',
            margin: '8px 12px 0 0',
            transition: 'color 0.15s',
          }}
          onClick={props.onClose}
          title="닫기"
          class="close-btn"
        >
          ×
        </button>
        <div
          style={{
            padding: '18px 24px 24px 24px',
            'overflow-y': 'auto',
            color: 'var(--theme-text)',
            'font-size': '1.08em',
            'line-height': 1.7,
          }}
        >
          {props.children}
        </div>
        <style>{`
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .close-btn:hover {
            color: var(--theme-accent);
          }
        `}</style>
      </div>
    </Show>
  );
}
