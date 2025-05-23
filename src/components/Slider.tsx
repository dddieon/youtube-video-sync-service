import { createSignal, onCleanup, onMount } from 'solid-js';
import styles from './Slider.module.css';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export default function Slider(props: SliderProps) {
  let sliderInputRef: HTMLInputElement | undefined;
  let tooltipInputRef: HTMLInputElement | undefined;

  const [isActive, setIsActive] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);

  // 바깥 클릭시 비활성화
  onMount(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !sliderInputRef?.contains(e.target as Node) &&
        !tooltipInputRef?.contains(e.target as Node)
      ) {
        setIsActive(false);
        setIsDragging(false);
        props.setIsEditing(false);
      }
    };
    const handleDocMouseUp = () => {
      setIsDragging(false);
      setIsActive(false);
      props.setIsEditing(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('mouseup', handleDocMouseUp);
    onCleanup(() => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('mouseup', handleDocMouseUp);
    });
  });

  // 드래그/클릭 활성화
  const handleSliderMouseDown = () => {
    setIsActive(true);
    setIsDragging(true);
    props.setIsEditing(true);
    setTimeout(() => tooltipInputRef?.focus(), 0);
  };
  const handleSliderClick = () => {
    setIsActive(true);
    props.setIsEditing(true);
    setTimeout(() => tooltipInputRef?.focus(), 0);
  };

  return (
    <div class={styles.sliderContainer} style={{ position: 'relative' }}>
      {/* 트랙(전체) */}
      <div class={styles.sliderTrack} />
      {/* 중앙 tick(0점) */}
      <div class={styles.sliderTick} />
      {/* 슬라이더 썸(조절 버튼) */}
      <input
        ref={(el) => (sliderInputRef = el)}
        type="range"
        min={props.min ?? -30}
        max={props.max ?? 30}
        step={props.step ?? 0.1}
        value={props.value}
        onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
        onMouseDown={handleSliderMouseDown}
        onClick={handleSliderClick}
        class={styles.customSlider}
      />
      {isDragging() && (
        <div
          class={styles.sliderThumbValue}
          style={{
            position: 'absolute',
            left: `calc(${((props.value - (props.min ?? -30)) / ((props.max ?? 30) - (props.min ?? -30))) * 100}% - 10px)`,
            top: '60%',
            transform: 'translate(-50%, 12px)',
            'z-index': 30,
            'pointer-events': 'auto',
          }}
        >
          <span>{props.value.toFixed(2)}초</span>
        </div>
      )}
    </div>
  );
}
