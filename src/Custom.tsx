import { createSignal, onMount } from 'solid-js';

function YoutubePlayer() {
  const [player1, setPlayer1] = createSignal<any>(null);
  const [player2, setPlayer2] = createSignal<any>(null);
  const [timeGap, setTimeGap] = createSignal<number>(5.08);

  onMount(() => {
    const onPlayerReady1 = () => {
      player1().loadVideoById('F4IKWKH9oyg'); // 첫 번째 동영상의 ID
    };

    const onPlayerReady2 = () => {
      setTimeout(() => {
        player2().loadVideoById('5jsdarfpsLk'); // 두 번째 동영상의 ID
        player2().playVideo();
      }, timeGap() * 1000); // timeGap 값을 초단위로 변경하여 두 번째 동영상을 재생합니다.
    };

    const onPlayerStateChange1 = (event: { data: YT.PlayerState }) => {
      if (event.data === window.YT.PlayerState.PLAYING) {
        const currentTime1 = player1().getCurrentTime();

        const seekTime = currentTime1 - timeGap();
        if (seekTime < 0) {
          setTimeout(
            () => {
              player2().seekTo(0);
              player2().playVideo();
            },
            Math.abs(seekTime) * 1000,
          );
        } else {
          player2().seekTo(seekTime);
        }
      }
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      setPlayer1(
        new window.YT.Player('youtube-player-1', {
          height: '315',
          width: '560',
          events: {
            onReady: onPlayerReady1,
            onStateChange: onPlayerStateChange1,
          },
        }),
      );

      setPlayer2(
        new window.YT.Player('youtube-player-2', {
          height: '315',
          width: '560',
          events: {
            onReady: onPlayerReady2,
          },
        }),
      );
    };
  });
  return (
    <div>
      <h1>YouTube Video Sync Service</h1>
      <div style={{ margin: '40px 0' }}>
        <label>
          <b style={{ margin: '4px' }}>Insert gap : </b>
          <input
            style={{ width: '80px' }}
            type="number"
            step="0.01" // 0.1 단위로 값을 조정할 수 있도록 설정합니다.
            value={timeGap()} // timeGap 상태를 input의 값으로 설정합니다.
            onInput={(e) => setTimeGap(parseFloat(e.target.value))} // input 값이 변경될 때 timeGap 상태를 업데이트합니다.
          />
          s
        </label>
      </div>
      <div id="youtube-player-1" />
      <div id="youtube-player-2" />
    </div>
  );
}

export default YoutubePlayer;
