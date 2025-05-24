import { JSX } from 'solid-js';

interface DiscordVolumeControlProps {
  value: number;
  onChange: (value: number) => void;
}

function VolumeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export default function DiscordVolumeControl(props: DiscordVolumeControlProps): JSX.Element {
  return (
    <div
      class="discord-volume-bg"
      style={{
        display: 'flex',
        'align-items': 'center',
        gap: '10px',
        position: 'absolute',
        left: '16px',
        bottom: '16px',
        'z-index': 10,
      }}
    >
      <span style={{ display: 'flex', 'align-items': 'center', height: '22px' }}>
        <VolumeIcon />
      </span>
      <div
        style={{
          position: 'relative',
          width: '110px',
          height: '18px',
          display: 'flex',
          'align-items': 'center',
        }}
      >
        {/* 전체 바(회색, 고정) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '100%',
            height: '4px',
            background: '#bbb',
            'border-radius': '2px',
            'z-index': 1,
          }}
        />
        {/* 차오르는 바(테마컬러) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: `${props.value}%`,
            height: '4px',
            background: 'var(--theme-accent)',
            'border-radius': '2px',
            'z-index': 2,
            transition: 'width 0.15s',
          }}
        />
        {/* 슬라이더(투명) */}
        <input
          type="range"
          min={0}
          max={100}
          value={props.value}
          onInput={(e) => props.onChange(Number(e.currentTarget.value))}
          style={{
            width: '110px',
            height: '32px',
            background: 'transparent',
            position: 'relative',
            'z-index': 3,
            appearance: 'none',
            outline: 'none',
            cursor: 'pointer',
          }}
          class="yt-volume-slider"
        />
        <style>{`
          .yt-volume-slider::-webkit-slider-thumb {
            opacity: 0;
            pointer-events: auto;
          }
          .yt-volume-slider::-moz-range-thumb {
            opacity: 0;
            pointer-events: auto;
          }
          .yt-volume-slider::-ms-thumb {
            opacity: 0;
            pointer-events: auto;
          }
          .yt-volume-slider {
            outline: none;
            cursor: pointer;
            background: transparent;
            height: 32px;
          }
          .yt-volume-slider::-webkit-slider-runnable-track,
          .yt-volume-slider::-ms-fill-lower,
          .yt-volume-slider::-ms-fill-upper,
          .yt-volume-slider::-moz-range-track {
            background: transparent;
          }
        `}</style>
      </div>
    </div>
  );
}
