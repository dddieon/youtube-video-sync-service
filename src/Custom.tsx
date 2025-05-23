import { createSignal, onMount, For } from 'solid-js';
import './Custom.css';
import Slider from './components/Slider';

interface VideoSettings {
  id: string;
  videoId?: string;
  videoId1?: string;
  videoId2?: string;
  timeGap: number;
  name: string;
  createdAt: number;
}

// @ts-ignore: interface Window is for global augmentation only
// @ts-ignore: _elementId, _options are for type signature only
declare global {
  interface Window {
    YT?: {
      Player: new (_elementId: string, _options: any) => any;
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function YoutubePlayer() {
  const [player1, setPlayer1] = createSignal<any>(null);
  const [player2, setPlayer2] = createSignal<any>(null);
  const [timeGap, setTimeGap] = createSignal(5);
  const [videoId1, setVideoId1] = createSignal('');
  const [videoId2, setVideoId2] = createSignal('');
  const [isSyncing, setIsSyncing] = createSignal(false);
  const [savedSettings, setSavedSettings] = createSignal<VideoSettings[]>([]);
  const [settingName, setSettingName] = createSignal('');
  const [isEditingSlider, setIsEditingSlider] = createSignal(false);
  const [isDirectInput, setIsDirectInput] = createSignal(false);
  const [video1Error, setVideo1Error] = createSignal('');
  const [video2Error, setVideo2Error] = createSignal('');

  const EXAMPLE_SETTING = {
    id: 'example',
    videoId1: 'F4IKWKH9oyg',
    videoId2: '5jsdarfpsLk',
    timeGap: 5,
    name: '예제(기본)',
    createdAt: 0,
  };

  let ytApiReady: Promise<void> | null = null;
  function loadYouTubeAPI() {
    if (!ytApiReady) {
      ytApiReady = new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }
        window.onYouTubeIframeAPIReady = () => resolve();
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      });
    }
    return ytApiReady;
  }

  async function safeCreateOrUpdatePlayer1(videoId: string) {
    await loadYouTubeAPI();
    createOrUpdatePlayer1(videoId);
  }

  async function safeCreateOrUpdatePlayer2(videoId: string) {
    await loadYouTubeAPI();
    createOrUpdatePlayer2(videoId);
  }

  async function createOrUpdatePlayer1(videoId: string) {
    const el = document.getElementById('youtube-player-1');
    if (!el) return;
    if (player1()) {
      player1().destroy();
      setPlayer1(null);
    }
    const instance = new window.YT!.Player('youtube-player-1', {
      height: '315',
      width: '560',
      playerVars: { mute: 1, enablejsapi: 1, origin: window.location.origin },
      events: {
        onReady: () => instance.loadVideoById(videoId),
        onStateChange: onPlayerStateChange,
        onError: () => setVideo1Error('화면용 영상 링크 올바르지 않음'),
      },
    });
    setPlayer1(instance);
  }

  async function createOrUpdatePlayer2(videoId: string) {
    const el = document.getElementById('youtube-player-2');
    if (!el) return;
    if (player2()) {
      player2().destroy();
      setPlayer2(null);
    }
    const instance = new window.YT!.Player('youtube-player-2', {
      height: '315',
      width: '560',
      playerVars: { mute: 0, enablejsapi: 1, origin: window.location.origin },
      events: {
        onReady: () => instance.loadVideoById(videoId),
        onStateChange: onPlayerStateChange2,
        onError: () => setVideo2Error('소리용 영상 링크 올바르지 않음'),
      },
    });
    setPlayer2(instance);
  }

  // 현재 재생 중인 영상들의 싱크를 다시 맞추는 함수
  const resyncPlayers = () => {
    const player1Instance = player1();
    const player2Instance = player2();

    if (!player1Instance || !player2Instance) return;

    const player1State = player1Instance.getPlayerState();
    const player2State = player2Instance.getPlayerState();

    // 두 플레이어가 모두 재생 중인 경우에만 싱크를 맞춤
    if (
      player1State === window.YT!.PlayerState.PLAYING &&
      player2State === window.YT!.PlayerState.PLAYING
    ) {
      const gap = timeGap();
      // 화면용 영상의 현재 시간을 기준으로 소리용 영상의 시간을 조정
      const currentTime = player1Instance.getCurrentTime();
      const targetTime = currentTime + gap;

      // 소리용 영상의 재생을 일시 중지
      player2Instance.pauseVideo();

      if (targetTime < 0) {
        // 음수 시간으로 시작해야 하는 경우
        player2Instance.seekTo(0);
        setTimeout(
          () => {
            player1Instance.seekTo(Math.abs(targetTime));
            player2Instance.playVideo();
          },
          Math.abs(targetTime) * 1000,
        );
      } else {
        player2Instance.seekTo(targetTime);
        player2Instance.playVideo();
      }
    }
  };

  // 로컬 스토리지에서 설정 목록 불러오기
  const loadSettingsList = () => {
    const settings = localStorage.getItem('videoSettingsList');
    if (settings) {
      setSavedSettings(JSON.parse(settings));
    }
  };

  // 설정 저장하기
  const saveSettings = () => {
    const newSetting: VideoSettings = {
      id: Date.now().toString(),
      videoId: videoId1(),
      timeGap: timeGap(),
      name: settingName() || `설정 ${savedSettings().length + 1}`,
      createdAt: Date.now(),
    };

    const updatedSettings = [...savedSettings(), newSetting];
    setSavedSettings(updatedSettings);
    localStorage.setItem('videoSettingsList', JSON.stringify(updatedSettings));
    setSettingName('');
  };

  // 설정 삭제하기
  const deleteSetting = (id: string) => {
    const updatedSettings = savedSettings().filter((setting) => setting.id !== id);
    setSavedSettings(updatedSettings);
    localStorage.setItem('videoSettingsList', JSON.stringify(updatedSettings));
  };

  onMount(() => {
    loadSettingsList();

    // YouTube IFrame API 로드 (최초 1회만)
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }
  });

  const onPlayerStateChange = (event: { data: number }) => {
    if (event.data === window.YT!.PlayerState.PLAYING && !isSyncing()) {
      const gap = timeGap();
      if (gap < 0) {
        // 음수 간격일 때는 소리용 영상이 먼저 재생
        syncPlayers(player2(), player1(), Math.abs(gap));
      } else {
        syncPlayers(player1(), player2(), -gap);
      }
    }
  };

  const onPlayerStateChange2 = (event: { data: number }) => {
    if (event.data === window.YT!.PlayerState.PLAYING && !isSyncing()) {
      const gap = timeGap();
      if (gap < 0) {
        // 음수 간격일 때는 화면용 영상이 나중에 재생
        syncPlayers(player1(), player2(), -Math.abs(gap));
      } else {
        syncPlayers(player2(), player1(), gap + 0.25);
      }
    }
  };

  const syncPlayers = (sourcePlayer: any, targetPlayer: any, timeDiff: number) => {
    setIsSyncing(true);
    const currentTime = sourcePlayer.getCurrentTime();
    const seekTime = currentTime + timeDiff;

    // 소리용 영상(플레이어2)의 재생을 일시 중지
    player2().pauseVideo();

    if (seekTime < 0) {
      // 음수 시간으로 시작해야 하는 경우
      targetPlayer.seekTo(0);
      setTimeout(
        () => {
          sourcePlayer.seekTo(Math.abs(seekTime));
          // 소리용 영상 재생 시작
          player2().playVideo();
        },
        Math.abs(seekTime) * 1000,
      );
    } else {
      targetPlayer.seekTo(seekTime);
      // 소리용 영상 재생 시작
      player2().playVideo();
    }
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div class="app-container">
      <div class="sidebar">
        <h2>저장된 설정</h2>
        <div class="settings-list">
          <For each={[EXAMPLE_SETTING, ...savedSettings()]}>
            {(setting) => (
              <div class="setting-item">
                <div
                  class="setting-info"
                  onClick={async () => {
                    setVideoId1(setting.videoId1 || '');
                    setVideoId2(setting.videoId2 || '');
                    setTimeGap(setting.timeGap);
                    await safeCreateOrUpdatePlayer1(setting.videoId1 || '');
                    await safeCreateOrUpdatePlayer2(setting.videoId2 || '');
                  }}
                >
                  <div class="setting-name">{setting.name}</div>
                  <div class="setting-details">
                    {setting.id === 'example' ? (
                      <>
                        <span>화면용: {setting.videoId1}</span>
                        <span>소리용: {setting.videoId2}</span>
                      </>
                    ) : (
                      <span>ID: {setting.videoId1 ?? ''}</span>
                    )}
                    <span>간격: {setting.timeGap}초</span>
                  </div>
                </div>
                {setting.id !== 'example' && (
                  <button class="delete-btn" onClick={() => deleteSetting(setting.id)}>
                    삭제
                  </button>
                )}
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="main-content">
        <h1 class="title">기타 연주 동기화 서비스</h1>

        <div class="settings-panel">
          <div class="setting-group">
            <label class="setting-label">
              <span>설정 이름:</span>
              <div class="input-group">
                <input
                  type="text"
                  placeholder="설정 이름을 입력하세요"
                  value={settingName()}
                  onInput={(e) => setSettingName(e.target.value)}
                />
              </div>
            </label>
          </div>

          <div class="setting-group">
            <label class="setting-label">
              <span>화면용 영상 ID:</span>
              <div class="input-group">
                <input
                  type="text"
                  placeholder="화면용 영상 ID를 입력하세요"
                  value={videoId1()}
                  onInput={async (e) => {
                    const newId = e.currentTarget.value;
                    setVideoId1(newId);
                    await safeCreateOrUpdatePlayer1(newId);
                  }}
                />
              </div>
            </label>
          </div>

          <div class="setting-group">
            <label class="setting-label">
              <span>소리용 영상 ID:</span>
              <div class="input-group">
                <input
                  type="text"
                  placeholder="소리용 영상 ID를 입력하세요"
                  value={videoId2()}
                  onInput={async (e) => {
                    const newId = e.currentTarget.value;
                    setVideoId2(newId);
                    await safeCreateOrUpdatePlayer2(newId);
                  }}
                />
              </div>
            </label>
          </div>

          <div class="setting-group">
            <span class="setting-label">시간 간격 (초):</span>
            <div class="input-group time-gap-group">
              {isDirectInput() ? (
                <>
                  <input
                    type="number"
                    step={0.01}
                    value={timeGap()}
                    onInput={(e) => {
                      const v = parseFloat(e.currentTarget.value);
                      setTimeGap(v);
                    }}
                    class="time-gap-input"
                    style={{
                      width: '100%',
                      'font-size': '1.1em',
                      'text-align': 'center',
                      'font-weight': 600,
                    }}
                  />
                  <button
                    type="button"
                    class="slider-toggle-btn"
                    style={{ 'margin-left': '12px' }}
                    onClick={() => setIsDirectInput(false)}
                  >
                    슬라이더로 돌아가기
                  </button>
                  <div
                    style={{
                      color: '#357abd',
                      'font-size': '0.95em',
                      'margin-top': '6px',
                      'font-weight': 500,
                    }}
                  >
                    제한 없이 값을 입력하세요 (음수/양수 모두 가능)
                  </div>
                </>
              ) : (
                <>
                  <Slider
                    value={timeGap()}
                    onChange={(v) => {
                      setTimeGap(v);
                      resyncPlayers();
                    }}
                    min={-60}
                    max={60}
                    step={0.1}
                    isEditing={isEditingSlider()}
                    setIsEditing={setIsEditingSlider}
                  />
                  <button
                    type="button"
                    class="slider-toggle-btn"
                    style={{ 'margin-top': '8px' }}
                    onClick={() => setIsDirectInput(true)}
                  >
                    직접입력
                  </button>
                </>
              )}
              <div class="help-text">
                음수 값: 소리용 영상이 먼저 재생
                <br />
                양수 값: 화면용 영상이 먼저 재생
                <br />
                <br />
                소리가 화면보다 빠르게 느껴진다면 → 음수 값으로 이동해주세요!
                <br />
                소리가 화면보다 느리게 느껴진다면 → 양수 값으로 이동해주세요!
              </div>
            </div>
          </div>

          <button class="save-btn" onClick={saveSettings}>
            현재 설정 저장
          </button>
        </div>

        <div class="video-container">
          <div class="video-wrapper">
            <h3>화면용 영상</h3>
            {videoId1() === '' ? (
              <div class="video-skeleton">화면용 영상 링크 필요</div>
            ) : video1Error() ? (
              <div class="video-skeleton error">{video1Error()}</div>
            ) : (
              <div id="youtube-player-1" />
            )}
          </div>
          <div class="video-wrapper">
            <h3>소리용 영상</h3>
            {videoId2() === '' ? (
              <div class="video-skeleton">소리용 영상 링크 필요</div>
            ) : video2Error() ? (
              <div class="video-skeleton error">{video2Error()}</div>
            ) : (
              <div id="youtube-player-2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default YoutubePlayer;
