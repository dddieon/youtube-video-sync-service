import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { isValidYoutubeIdInClipboard } from '../utils/youtube';

interface Props {
  onPaste: (id: string) => void;
}

export default function PasteButton(props: Props) {
  const [canPaste, setCanPaste] = createSignal(false);
  let checkInterval: number;

  const checkClipboard = async () => {
    const isValid = await isValidYoutubeIdInClipboard();
    setCanPaste(isValid);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      props.onPaste(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  onMount(() => {
    // 초기 체크
    checkClipboard();
    // 주기적으로 체크 (1초마다)
    checkInterval = window.setInterval(checkClipboard, 1000);
  });

  onCleanup(() => {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
  });

  return (
    <Show when={canPaste()}>
      <button
        onClick={handlePaste}
        style={{
          background: 'var(--theme-accent)',
          color: '#fff',
          border: 'none',
          'border-radius': '6px',
          padding: '6px 12px',
          'font-size': '0.9em',
          'font-weight': 600,
          cursor: 'pointer',
          transition: 'background 0.15s',
          'margin-left': '8px',
        }}
        class="paste-btn"
        title="클립보드의 유튜브 링크/ID 붙여넣기"
      >
        붙여넣기
      </button>
      <style>{`
        .paste-btn:hover {
          background: var(--theme-accent-hover);
        }
      `}</style>
    </Show>
  );
}
