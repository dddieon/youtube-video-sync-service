import styles from './App.module.css';
import Custom from './Custom';
import { JSX } from 'solid-js';
import HelpFabButton from './components/HelpFabButton';
import HelpModal from './components/HelpModal';
import { createSignal } from 'solid-js';

const App: () => JSX.Element = () => {
  const [helpOpen, setHelpOpen] = createSignal(false);

  return (
    <>
      <div class={styles.App}>
        <Custom />
      </div>
      <HelpFabButton onClick={() => setHelpOpen(true)} />
      <HelpModal open={helpOpen()} onClose={() => setHelpOpen(false)}>
        <h2
          style={{
            color: 'var(--theme-accent)',
            'font-weight': 800,
            'font-size': '1.18em',
            'margin-bottom': '10px',
          }}
        >
          유튜브 영상 싱크를 맞춰요!
        </h2>
        <p style={{ 'margin-bottom': '16px', 'line-height': 1.6 }}>
          유튜브를 통해 악기 연주를 하는 사람을 위한 서비스입니다.
          <br />
          <b>[화면용 영상]</b>에서는 악보가 있는 영상을,
          <br />
          <b>[소리용 영상]</b>에서는 음원이 포함된 영상링크를 넣으면 됩니다.
          <br />
          유튜브 프리미엄을 쓰면서 광고를 보지 않는 사람을 기준으로 만들어졌습니다.
        </p>

        <h3
          style={{
            color: 'var(--theme-text)',
            'font-weight': 700,
            'font-size': '1.1em',
            'margin-bottom': '8px',
          }}
        >
          유튜브 영상 ID 가져오는 방법
        </h3>
        <ol style={{ 'padding-left': '20px', 'margin-bottom': '16px' }}>
          <li>
            유튜브 영상 URL에서{' '}
            <code
              style={{
                background: 'var(--theme-panel)',
                padding: '2px 6px',
                'border-radius': '4px',
              }}
            >
              v=
            </code>{' '}
            뒤에 오는 문자열이 영상 ID입니다.
          </li>
          <li>
            예시:{' '}
            <code
              style={{
                background: 'var(--theme-panel)',
                padding: '2px 6px',
                'border-radius': '4px',
              }}
            >
              https://youtube.com/watch?v=dQw4w9WgXcQ
            </code>
            에서{' '}
            <code
              style={{
                background: 'var(--theme-panel)',
                padding: '2px 6px',
                'border-radius': '4px',
              }}
            >
              dQw4w9WgXcQ
            </code>
            가 영상 ID입니다.
          </li>
        </ol>
        <div
          style={{
            color: 'var(--theme-accent)',
            'font-weight': 700,
            'margin-bottom': '18px',
            padding: '14px',
            background: 'var(--theme-panel)',
            'border-radius': '8px',
            border: '2px solid var(--theme-accent)',
            'box-shadow': '0 2px 8px 0 rgba(255,79,163,0.08)',
          }}
        >
          💡 유튜브 링크 또는 ID를 클립보드에 복사하면 <b>'붙여넣기'</b> 버튼이 화면에 표기됩니다
          <br />
          <span style={{ color: 'var(--theme-text)', 'font-weight': 500, 'font-size': '0.97em' }}>
            권한이 거부된 경우, 크롬에서는 [우측 상단 메뉴]-[설정]-[사이트 설정]에서 허용상태로
            변경할 수 있습니다.
          </span>
        </div>

        <h3
          style={{
            color: 'var(--theme-text)',
            'font-weight': 700,
            'font-size': '1.1em',
            'margin-bottom': '8px',
          }}
        >
          주요 기능
        </h3>
        <ul style={{ 'padding-left': '20px', 'margin-bottom': '16px' }}>
          <li>
            <b>영상 싱크:</b> [화면용 영상]의 재생시간이 변경되면 [소리용 영상]도 자동으로
            동기화됩니다.
          </li>
          <li>
            <b>레이아웃 전환:</b> 우상단 아이콘 버튼으로 [기본보기]와 [화면용 영상만 보기]를 전환할
            수 있습니다.
          </li>
          <li>
            <b>전체화면:</b> 우상단 전체화면 아이콘으로 영상 전체화면 전환이 가능합니다.
          </li>
          <li>
            <b>볼륨 조절:</b> 영상 하단의 흰색 슬라이더로 소리용 영상 볼륨을 조절할 수 있습니다.
          </li>
        </ul>
        <div
          style={{
            'margin-top': '24px',
            'padding-top': '16px',
            'border-top': '1px solid var(--theme-border)',
            'text-align': 'center',
          }}
        >
          <div
            style={{
              color: 'var(--theme-text-muted)',
              'font-size': '0.9em',
              'margin-bottom': '4px',
            }}
          >
            문의사항이 있으시다면
          </div>
          <a
            href="mailto:hocldy@naver.com"
            style={{
              color: 'var(--theme-accent)',
              'font-weight': 600,
              'font-size': '1.05em',
              'text-decoration': 'none',
              transition: 'color 0.15s',
              display: 'inline-block',
              padding: '4px 12px',
              'border-radius': '6px',
              background: 'var(--theme-panel)',
              border: '1px solid var(--theme-border)',
            }}
            class="contact-email"
          >
            hocldy@naver.com
          </a>
          <style>{`
            .contact-email:hover {
              color: var(--theme-accent-hover);
              background: var(--theme-card);
            }
          `}</style>
        </div>
      </HelpModal>
    </>
  );
};

export default App;
