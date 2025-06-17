export default function HelpFabButton(props: { onClick: () => void }) {
  return (
    <button class="help-fab-btn" onClick={props.onClick} title="도움말">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="none" />
        <text
          x="16"
          y="23"
          font-size="28"
          font-weight="900"
          fill="#fff"
          font-family="Segoe UI, Arial, sans-serif"
          text-anchor="middle"
        >
          ?
        </text>
      </svg>
      <style>{`
        .help-fab-btn:hover, .help-fab-btn:focus {
          box-shadow: 0 8px 28px 0 #181a1b66;
          background: var(--theme-accent-hover);
        }
      `}</style>
    </button>
  );
}
