import { createSignal } from 'solid-js';
import styles from './VolumeSlider.module.css';

interface VolumeSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export default function VolumeSlider(props: VolumeSliderProps) {
  const [isHover, setIsHover] = createSignal(false);
  return (
    <div
      class={styles.volumeSliderContainer + (isHover() ? ' ' + styles.hover : '')}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <span class={styles.icon}>
        {props.value === 0 ? '🔇' : props.value < 40 ? '🔈' : props.value < 80 ? '🔉' : '🔊'}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={props.value}
        onInput={(e) => props.onChange(Number(e.currentTarget.value))}
        class={styles.slider}
      />
      <span class={styles.value}>{props.value}</span>
    </div>
  );
}
