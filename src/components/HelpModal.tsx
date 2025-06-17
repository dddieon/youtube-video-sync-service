import { JSX, Show } from 'solid-js';

export default function HelpModal(props: {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}) {
  return (
    <Show when={props.open}>
      <div class="help-modal">
        <div class="help-modal-header">
          <h3>도움말</h3>
          <button class="close-button" onClick={props.onClose}>
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="help-modal-content">{props.children}</div>
      </div>
    </Show>
  );
}
