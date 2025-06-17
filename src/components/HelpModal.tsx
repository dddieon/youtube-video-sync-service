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
        <div class="help-modal-content">
          <p>이 앱은 YouTube 영상의 화면과 소리를 분리하여 재생할 수 있게 해주는 도구입니다.</p>
          <h4>사용 방법</h4>
          <ol>
            <li>화면용 영상 ID와 소리용 영상 ID를 입력합니다.</li>
            <li>시간 간격을 조절하여 두 영상의 싱크를 맞춥니다.</li>
            <li>저장 버튼을 눌러 현재 설정을 저장할 수 있습니다.</li>
          </ol>
          <h4>단축키</h4>
          <ul>
            <li>스페이스바: 재생/일시정지</li>
            <li>화살표 키: 5초 앞/뒤로 이동</li>
            <li>숫자 키: 해당 초로 이동 (예: 1 → 10초)</li>
          </ul>
        </div>
      </div>
    </Show>
  );
}
