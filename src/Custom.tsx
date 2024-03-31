import { createSignal, onMount } from 'solid-js';

function YoutubePlayer() {
  const [player1, setPlayer1] = createSignal(null);
  const [player2, setPlayer2] = createSignal(null);
  const [timeGap, setTimeGap] = createSignal(5);
  const [videoId1, setVideoId1] = createSignal('F4IKWKH9oyg');
  const [videoId2, setVideoId2] = createSignal('5jsdarfpsLk');

  onMount(() => {
    const onPlayerReady1 = () => {
      player1().loadVideoById(videoId1());
    };

    const onPlayerReady2 = () => {
      player2().loadVideoById(videoId2());
    };
    // 기존 코드
    const [isSyncing, setIsSyncing] = createSignal(false); // 동기화 중 상태를 추적하는 변수 추가

    const syncPlayers = (sourcePlayer, targetPlayer, timeDiff) => {
      setIsSyncing(true); // 동기화 시작 시 플래그 설정
      const currentTime = sourcePlayer.getCurrentTime();
      const seekTime = currentTime + timeDiff;

      if (seekTime < 0) {
        setTimeout(
          () => {
            targetPlayer.seekTo(0);
            targetPlayer.playVideo();
          },
          Math.abs(seekTime) * 1000,
        );
      } else {
        targetPlayer.seekTo(seekTime);
        targetPlayer.playVideo();
      }
      setTimeout(() => setIsSyncing(false), 1000); // 동기화 완료 후 충분한 시간을 두고 플래그 해제
    };

    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING && !isSyncing()) {
        syncPlayers(player1(), player2(), -timeGap());
      }
    };

    const onPlayerStateChange2 = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING && !isSyncing()) {
        syncPlayers(player2(), player1(), timeGap() + 0.25);
      }
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setPlayer1(
        new window.YT.Player('youtube-player-1', {
          height: '315',
          width: '560',
          events: {
            onReady: onPlayerReady1,
            onStateChange: onPlayerStateChange,
          },
        }),
      );

      setPlayer2(
        new window.YT.Player('youtube-player-2', {
          height: '315',
          width: '560',
          events: {
            onReady: onPlayerReady2,
            onStateChange: onPlayerStateChange2,
          },
        }),
      );
    };
  });

  const updateVideoId1 = (newId: string) => {
    setVideoId1(newId);
    player1()?.loadVideoById(newId);
  };

  const updateVideoId2 = (newId: string) => {
    setVideoId2(newId);
    player2()?.loadVideoById(newId);
  };

  return (
    <div>
      <h1>YouTube Video Sync Service</h1>
      <label>
        <b style={{ margin: '4px' }}>Insert gap : </b>
        <input
          style={{ width: '80px' }}
          type="number"
          step="0.01"
          value={timeGap()}
          onInput={(e) => setTimeGap(parseFloat(e.target.value))}
        />
      </label>
      <div>
        <input
          type="text"
          placeholder="첫 번째 비디오 ID"
          onInput={(e) => updateVideoId1(e.target.value)}
        />
        <button onClick={() => updateVideoId1(videoId1())}>Update Video 1</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="두 번째 비디오 ID"
          onInput={(e) => updateVideoId2(e.target.value)}
        />
        <button onClick={() => updateVideoId2(videoId2())}>Update Video 2</button>
      </div>
      <div id="youtube-player-1" />
      <div id="youtube-player-2" />
    </div>
  );
}

export default YoutubePlayer;
