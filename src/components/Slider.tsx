import { onCleanup, Show } from 'solid-js';
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

  // 포커스 해제 시 자동으로 편집 종료
  onCleanup(() => {
    props.setIsEditing(false);
  });

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
        onClick={() => {
          props.setIsEditing(true);
          setTimeout(() => tooltipInputRef?.focus(), 0);
        }}
        class={styles.customSlider}
      />
      {/* 썸 위치에 맞춰 트랙 위에 툴팁 */}
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
        <Show
          when={props.isEditing}
          fallback={
            <span
              onClick={() => {
                props.setIsEditing(true);
                setTimeout(() => tooltipInputRef?.focus(), 0);
              }}
              style={{ cursor: 'pointer' }}
            >
              {props.value.toFixed(2)}초
            </span>
          }
        >
          <input
            ref={(el) => (tooltipInputRef = el)}
            type="number"
            min={props.min ?? -30}
            max={props.max ?? 30}
            step={props.step ?? 0.01}
            value={props.value}
            onInput={(e) => {
              const value = parseFloat(e.currentTarget.value);
              if (value >= (props.min ?? -30) && value <= (props.max ?? 30)) props.onChange(value);
            }}
            onBlur={() => props.setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                props.setIsEditing(false);
                sliderInputRef?.focus();
              }
            }}
            style={{
              width: '36px',
              'text-align': 'center',
              'font-weight': '600',
              'font-size': '0.92em',
              border: '1px solid #4a90e2',
              'border-radius': '6px',
              padding: '1px 2px',
              background: '#f8fafd',
              color: '#357abd',
              outline: 'none',
              'box-shadow': 'none',
              margin: 0,
            }}
          />
        </Show>
      </div>
    </div>
  );
}
