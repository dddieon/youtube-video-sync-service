import { createSignal, onMount, For, createEffect } from 'solid-js';
import './reset.css';
import './Custom.css';
import Slider from './components/Slider';
import VolumeSlider from './components/VolumeSlider';
import VolumeKnob from './components/VolumeKnob';
import DiscordVolumeControl from './components/DiscordVolumeControl';
import DiscordVideoActionButtons from './components/DiscordVideoActionButtons';
import PasteButton from './components/PasteButton';
import { parseYoutubeId } from './utils/youtube';

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
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
        CUED: number;
        UNSTARTED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// SVG 아이콘 정의 (디스코드 스타일)
const iconStroke = 'var(--theme-text)';
const iconStrokeWidth = 2.2;

const MonitorIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke={iconStroke}
    stroke-width={iconStrokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="5" width="18" height="12" rx="3" />
    <path d="M8 19h8" />
  </svg>
);
const VolumeIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke={iconStroke}
    stroke-width={iconStrokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const FullscreenIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke={iconStroke}
    stroke-width={iconStrokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <polyline points="4 4 9 4 9 9" />
    <polyline points="20 4 15 4 15 9" />
    <polyline points="4 20 9 20 9 15" />
    <polyline points="20 20 15 20 15 15" />
  </svg>
);
const SettingsIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke={iconStroke}
    stroke-width={iconStrokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 11 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke={iconStroke}
    stroke-width={iconStrokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function YoutubePlayer() {
  const [player1, setPlayer1] = createSignal<any>(null);
  const [player2, setPlayer2] = createSignal<any>(null);
  const [timeGap, setTimeGap] = createSignal(5);
  const [videoId1, setVideoId1] = createSignal('');
  const [videoId2, setVideoId2] = createSignal('');
  const [savedSettings, setSavedSettings] = createSignal<VideoSettings[]>([]);
  const [settingName, setSettingName] = createSignal('');
  const [isEditingSlider, setIsEditingSlider] = createSignal(false);
  const [isDirectInput, setIsDirectInput] = createSignal(false);
  const [video1Error, setVideo1Error] = createSignal('');
  const [video2Error, setVideo2Error] = createSignal('');
  const [layoutMode, setLayoutMode] = createSignal<'default' | 'main-only' | 'equal'>('default');
  const [volume, setVolume] = createSignal(100);
  const [showVolume, setShowVolume] = createSignal(false);
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

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
    if (player2()) {
      player2().destroy();
      setPlayer2(null);
      await new Promise((res) => setTimeout(res, 100)); // 100ms 딜레이
    }
    createOrUpdatePlayer2(videoId);
  }

  // 현재 재생 중인 영상들의 싱크를 다시 맞추는 함수
  const resyncPlayers = () => {
    const player1Instance = player1();
    const player2Instance = player2();
    if (!player1Instance || !player2Instance) return;

    const gap = timeGap();
    const currentTime = player1Instance.getCurrentTime();
    const targetTime = currentTime - gap;

    player2Instance.pauseVideo();

    if (targetTime < 0) {
      player2Instance.seekTo(0);
      setTimeout(
        () => {
          player2Instance.playVideo();
        },
        Math.abs(targetTime) * 1000,
      );
    } else {
      player2Instance.seekTo(targetTime);
      player2Instance.playVideo();
    }

    console.log('[SYNC] resyncPlayers: 소리용 영상 시간 조정', {
      gap,
      currentTime,
      targetTime,
    });
  };

  // 시간 간격 변경 시 싱크 맞추기
  function syncTimeGap() {
    resyncPlayers();
  }

  let syncTimeout: ReturnType<typeof setTimeout> | null = null;
  let allowSoundPlay = false;

  const onPlayerStateChange = (event: { data: number }) => {
    const player1Instance = player1();
    const player2Instance = player2();
    if (!player1Instance || !player2Instance) {
      console.log('[SYNC] player1 또는 player2 인스턴스 없음');
      return;
    }

    // 재생 구간 이동 시에는 에러를 발생시키지 않음
    if (event.data === window.YT!.PlayerState.BUFFERING) {
      return;
    }

    if (syncTimeout) {
      console.log('[SYNC] 기존 타이머 clear');
      clearTimeout(syncTimeout);
      syncTimeout = null;
    }
    allowSoundPlay = false;

    const gap = timeGap();
    const currentTime = player1Instance.getCurrentTime();
    const targetTime = currentTime - gap;
    console.log('[SYNC] onPlayerStateChange', {
      eventData: event.data,
      gap,
      currentTime,
      targetTime,
    });

    if (event.data === window.YT!.PlayerState.PLAYING) {
      player1Instance.playVideo();
      player2Instance.pauseVideo();

      // 화면용 영상의 현재 시간을 기준으로 소리용 영상 시간 계산
      if (targetTime < 0) {
        player2Instance.seekTo(0);
        console.log(
          `[SYNC] targetTime < 0: 소리용 영상 0초에서 ${Math.abs(targetTime)}초 대기 후 재생`,
        );
        syncTimeout = setTimeout(
          () => {
            console.log('[SYNC] 소리용 영상 playVideo() 실행');
            allowSoundPlay = true;
            player2Instance.playVideo();
            syncTimeout = null;
          },
          Math.abs(targetTime) * 1000,
        );
      } else {
        allowSoundPlay = true;
        player2Instance.seekTo(targetTime);
        console.log('[SYNC] seek/재생: 소리용 영상 targetTime에서 바로 재생');
        player2Instance.playVideo();
      }
    } else if (event.data === window.YT!.PlayerState.PAUSED) {
      console.log('[SYNC] 화면용 영상 PAUSED, 소리용 영상도 일시정지');
      player2Instance.pauseVideo();
      if (syncTimeout) {
        console.log('[SYNC] 일시정지로 타이머 clear');
        clearTimeout(syncTimeout);
        syncTimeout = null;
      }
      allowSoundPlay = false;
    }
  };

  const onPlayerStateChange2 = (event: { data: number }) => {
    const player2Instance = player2();
    if (!player2Instance) return;

    // 재생 구간 이동 시에는 에러를 발생시키지 않음
    if (event.data === window.YT!.PlayerState.BUFFERING) {
      return;
    }

    // gap 타이머 끝나기 전 PLAYING 상태면 무조건 멈춤
    if (!allowSoundPlay && event.data === window.YT!.PlayerState.PLAYING) {
      console.log('[SYNC] 소리용 영상이 gap 대기 중인데 PLAYING 상태! 강제 pause');
      player2Instance.pauseVideo();
    }
  };

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
      videoId: videoId,
      playerVars: {
        mute: 1,
        enablejsapi: 1,
        origin: window.location.origin,
        autoplay: 0,
        playsinline: 1,
        start: 0,
      },
      events: {
        onReady: () => {
          setTimeout(() => {
            instance.pauseVideo();
          }, 100);
        },
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
      videoId: videoId,
      playerVars: {
        mute: 0,
        enablejsapi: 1,
        origin: window.location.origin,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        autoplay: 0,
        playsinline: 1,
        start: 0,
      },
      events: {
        onReady: () => {
          setTimeout(() => {
            instance.pauseVideo();
          }, 100);
        },
        onStateChange: onPlayerStateChange2,
        onError: () => setVideo2Error('소리용 영상 링크 올바르지 않음'),
      },
    });
    setPlayer2(instance);
  }

  // 로컬 스토리지에서 설정 목록 불러오기
  const loadSettingsList = () => {
    const settings = localStorage.getItem('videoSettingsList');
    if (settings) {
      setSavedSettings(JSON.parse(settings));
    }
  };

  // 설정 저장하기
  function handleSaveBtnClick() {
    if (!videoId1() || !videoId2()) {
      alert('화면용과 소리용 영상 ID를 모두 입력해주세요.');
      return;
    }
    const name = window.prompt('저장할 설정 이름을 입력하세요');
    if (name && name.trim() !== '') {
      setSettingName(name.trim());
      const newSetting: VideoSettings = {
        id: Date.now().toString(),
        videoId1: videoId1(),
        videoId2: videoId2(),
        timeGap: timeGap(),
        name: name.trim(),
        createdAt: Date.now(),
      };

      const updatedSettings = [...savedSettings(), newSetting];
      setSavedSettings(updatedSettings);
      localStorage.setItem('videoSettingsList', JSON.stringify(updatedSettings));
      setSettingName('');
    }
  }

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

  // 전체화면 핸들러: 화면용 영상(main-video) 전체화면
  function handleFullscreen() {
    const el = document.getElementById('youtube-player-1');
    if (el && el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el && (el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    }
  }

  createEffect(() => {
    const p2 = player2();
    if (!p2) return;
    if (videoId1() === '' || video1Error()) {
      p2.pauseVideo();
    }
  });

  // 볼륨 슬라이더 조작 시 player2 볼륨 연동
  function handleVolumeChange(v: number) {
    setVolume(v);
    const p2 = player2();
    if (p2) p2.setVolume(v);
  }

  // player2가 생성될 때 볼륨 동기화
  createEffect(() => {
    const p2 = player2();
    if (p2) p2.setVolume(volume());
  });

  return (
    <div class="app-container">
      <div class="mobile-header">
        <button class="mobile-menu-button" onClick={() => setIsSidebarOpen(!isSidebarOpen())}>
          <MenuIcon />
        </button>
        <div class="app-title">Youtube Syncer</div>
      </div>
      <div class={`sidebar ${isSidebarOpen() ? 'open' : ''}`}>
        <h2 class="title">
          <span class="icon">
            <SettingsIcon />
          </span>
          Youtube Syncer
        </h2>
        <div style={{ flex: 1 }}>
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
                      setVideo1Error('');
                      setVideo2Error('');
                      await safeCreateOrUpdatePlayer1(setting.videoId1 || '');
                      await safeCreateOrUpdatePlayer2(setting.videoId2 || '');
                      setTimeout(() => {
                        const p1 = player1();
                        if (p1) p1.playVideo();
                      }, 1000);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div class="setting-name">{setting.name}</div>
                    <div class="setting-details">
                      <span>화면용: {setting.videoId1}</span>
                      <span>소리용: {setting.videoId2}</span>
                      <span>간격: {setting.timeGap}초</span>
                    </div>
                  </div>
                  {setting.id !== 'example' && (
                    <button class="delete-btn" onClick={() => deleteSetting(setting.id)}>
                      <XIcon />
                    </button>
                  )}
                </div>
              )}
            </For>
          </div>
        </div>
        <button class="save-btn" onClick={handleSaveBtnClick}>
          현재 설정 저장
        </button>
      </div>

      <div class="main-content">
        <div
          class={
            layoutMode() === 'main-only'
              ? 'video-layout main-only'
              : layoutMode() === 'equal'
                ? 'video-layout equal'
                : 'video-layout'
          }
        >
          <div class="main-video-area">
            <div class="main-video-block">
              <div class="video-label">
                <span class="icon">
                  <MonitorIcon />
                </span>
                화면용 영상
              </div>
              <div class="main-video video-wrapper">
                <div id="youtube-player-1" class="youtube-player" />
                {(videoId1() === '' || video1Error()) && (
                  <div class={`video-skeleton${video1Error() ? ' error' : ' preview'}`}>
                    {video1Error() ? (
                      <span class="preview-text">{video1Error()}</span>
                    ) : (
                      <>
                        <span class="preview-icon">🖥️</span>
                        <span class="preview-text">ID를 입력하세요</span>
                      </>
                    )}
                  </div>
                )}
                <DiscordVideoActionButtons
                  mode={layoutMode() === 'main-only' ? 'main-only' : 'equal'}
                  onToggleLayout={() =>
                    setLayoutMode(layoutMode() === 'main-only' ? 'equal' : 'main-only')
                  }
                  onFullscreen={handleFullscreen}
                />
              </div>
            </div>
            <div
              class={
                layoutMode() === 'main-only' ? 'sub-video-area visually-hidden' : 'sub-video-area'
              }
            >
              <div class="video-label" style={{ display: 'flex', 'align-items': 'center' }}>
                <span class="icon">
                  <VolumeIcon />
                </span>
                소리용 영상
              </div>
              <div
                class="sub-video video-wrapper"
                style={{ cursor: 'not-allowed', position: 'relative' }}
              >
                <div id="youtube-player-2" class="youtube-player" />
                {(videoId2() === '' || video2Error()) && (
                  <div class={`video-skeleton${video2Error() ? ' error' : ' preview'}`}>
                    {video2Error() ? (
                      <span class="preview-text">{video2Error()}</span>
                    ) : (
                      <>
                        <span class="preview-icon">🔈</span>
                        <span class="preview-text">ID를 입력하세요</span>
                      </>
                    )}
                  </div>
                )}
                <DiscordVolumeControl value={volume()} onChange={handleVolumeChange} />
              </div>
            </div>
          </div>
        </div>

        <div class="settings-panel">
          <div class="input-row">
            <div class="setting-group">
              <div class="form-label-row">
                <span class="form-label">화면용 ID</span>
              </div>
              <div class="input-group">
                <input
                  type="text"
                  placeholder="화면용 영상 ID를 입력하세요"
                  value={videoId1()}
                  onInput={async (e) => {
                    const newId = e.currentTarget.value;
                    setVideoId1(newId);
                    setVideo1Error('');
                    await safeCreateOrUpdatePlayer1(newId);
                    resyncPlayers();
                  }}
                />
                <PasteButton
                  onPaste={async (text) => {
                    const id = parseYoutubeId(text);
                    if (id) {
                      setVideoId1(id);
                      setVideo1Error('');
                      await safeCreateOrUpdatePlayer1(id);
                      resyncPlayers();
                    }
                  }}
                />
              </div>
            </div>
            <div class="setting-group">
              <div class="form-label-row">
                <span class="form-label">소리용 ID</span>
              </div>
              <div class="input-group">
                <input
                  type="text"
                  placeholder="소리용 영상 ID를 입력하세요"
                  value={videoId2()}
                  onInput={async (e) => {
                    const newId = e.currentTarget.value;
                    setVideoId2(newId);
                    setVideo2Error('');
                    await safeCreateOrUpdatePlayer2(newId);
                    resyncPlayers();
                  }}
                />
                <PasteButton
                  onPaste={async (text) => {
                    const id = parseYoutubeId(text);
                    if (id) {
                      setVideoId2(id);
                      setVideo2Error('');
                      await safeCreateOrUpdatePlayer2(id);
                      resyncPlayers();
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div class="setting-group">
            <div class="form-label-row">
              <span class="form-label">현재 시간 간격 (초 단위 / 소수점 및 음수 가능)</span>
            </div>
            <div
              style={{
                display: 'flex',
                'flex-direction': 'column',
                'align-items': 'flex-start',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', 'align-items': 'center', gap: '0' }}>
                <input
                  type="number"
                  step={0.01}
                  value={timeGap()}
                  onInput={(e) => {
                    const val = e.currentTarget.value;
                    if (val === '' || val === '-') {
                      setTimeGap(0);
                      return;
                    }
                    const v = Number(val);
                    if (!isNaN(v)) {
                      setTimeGap(v);
                      syncTimeGap();
                    }
                  }}
                  class="time-gap-input"
                  style={{
                    width: '80px',
                    'font-size': '1.1em',
                    'font-weight': 600,
                  }}
                />
                <span class="time-gap-unit">s</span>
              </div>
              <span
                class="slider-group"
                style={{ flex: 1, display: 'flex', 'flex-direction': 'column' }}
              >
                <Slider
                  value={timeGap()}
                  onChange={(v) => {
                    setTimeGap(v);
                    syncTimeGap();
                  }}
                  min={-60}
                  max={60}
                  step={0.1}
                  isEditing={isEditingSlider()}
                  setIsEditing={setIsEditingSlider}
                />
                <div class="sliderDirectionHintRow">
                  <span class="sliderDirectionHintLeft">← 소리가 느리면 왼쪽</span>
                  <span class="sliderDirectionHintRight">소리가 빠르면 오른쪽 →</span>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        class="help-fab-btn"
        onClick={() => {
          const helpUrl = 'https://github.com/jiwondev/youtube-video-sync-service';
          window.open(helpUrl, '_blank');
        }}
      >
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
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>
    </div>
  );
}

export default YoutubePlayer;
