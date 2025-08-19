import React, { useEffect, useMemo, useRef, useState } from 'react';

import eyedropperIcon from '../../assets/icons/eyedropper.svg';
import {
  Bar,
  Close,
  Dot,
  Dots,
  Footer,
  Grid,
  GridCell,
  Head,
  HexInput,
  Panel,
  Percent,
  PlusBtn,
  Popover,
  Row,
  SectionLabel,
  SelectFake,
  Tail,
  Title,
  Trigger,
  Wrapper,
} from './styles';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const toHex = (val) => {
  if (!val) return '#000000';
  const m = String(val).trim();
  if (m.startsWith('#') && (m.length === 7 || m.length === 4)) {
    if (m.length === 4) {
      const x = m
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('');
      return `#${x}`;
    }
    return m.slice(0, 7);
  }
  return /^([0-9a-f]{6})$/i.test(m) ? `#${m}` : '#000000';
};

// rgba(...) → #RRGGBB
const rgbaToHex = (val) => {
  const m =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i.exec(
      String(val).trim(),
    );
  if (!m) return null;
  const r = Math.max(0, Math.min(255, Number(m[1])));
  const g = Math.max(0, Math.min(255, Number(m[2])));
  const b = Math.max(0, Math.min(255, Number(m[3])));
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
};

// универсальный нормализатор
const toHexAny = (val) => {
  if (!val && val !== 0) return '#000000';
  return rgbaToHex(val) || toHex(val);
};

const hexToRgb = (h) => {
  const hex = toHexAny(h);
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r, g, b) => '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');

const toRgbaStr = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha) / 100})`;
};

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

const buildGrid = () => {
  const cols = 12;
  const rows = 10;
  const hues = Array.from({ length: cols }, (_, i) => (i / cols) * 360);
  const shift = 280;
  const H = hues.map((h) => (h + shift) % 360);
  const cells = [];
  for (let r = 0; r < rows; r++) {
    const l = 0.12 + (r / (rows - 1)) * 0.76;
    for (let c = 0; c < cols; c++) {
      const [R, G, B] = hslToRgb(H[c], 0.95, l);
      cells.push({ r: R, g: G, b: B, id: `${r}-${c}` });
    }
  }
  return { cols, rows, cells };
};

const DEFAULT_SWATCHES = [
  '#000000',
  '#4a4a4a',
  '#8a8a8a',
  '#c0c0c0',
  '#ffffff',
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#5ac8fa',
  '#007aff',
  '#5856d6',
];

export default function PalettePicker({
  value,
  onChange,
  withAlpha = true,
  recentKey = 'palette_recent_colors',
  title = 'Цвета',
  emitAlpha = false,
  onChangeAlpha,
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('bottom');
  const [hex, setHex] = useState(toHexAny(value));
  const [alpha, setAlpha] = useState(100);
  const [customDots, setCustomDots] = useState([]);
  const [isPicking, setIsPicking] = useState(false);
  const ref = useRef(null);
  const panelRef = useRef(null);
  const colorInputRef = useRef(null);

  useEffect(() => setHex(toHexAny(value)), [value]);
  const rgb = useMemo(() => hexToRgb(hex), [hex]);

  const recent = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(recentKey) || '[]');
    } catch {
      return [];
    }
  }, [recentKey]);

  const pushRecent = (c) => {
    const next = [c, ...recent.filter((x) => x !== c)].slice(0, 8);
    try {
      localStorage.setItem(recentKey, JSON.stringify(next));
    } catch {}
  };

  const recalcPlacement = () => {
    if (!ref.current) return;
    const trig = ref.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const spaceBelow = vh - trig.bottom;
    const spaceAbove = trig.top;
    const estimated = panelRef.current ? panelRef.current.getBoundingClientRect().height : 320;
    if (spaceBelow < estimated + 8 && spaceAbove > spaceBelow) setPlacement('top');
    else setPlacement('bottom');
  };

  useEffect(() => {
    if (!open) return;
    recalcPlacement();
    const onWin = () => recalcPlacement();
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, true);
    return () => {
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin, true);
    };
  }, [open]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const emit = (h, a = alpha) => {
    if (emitAlpha) onChange?.(toRgbaStr(h, a));
    else onChange?.(h);
    onChangeAlpha?.(a);
  };

  const apply = (c) => {
    const h = toHexAny(c);
    setHex(h);
    emit(h);
    pushRecent(h);
  };

  const handleAlpha = (val) => {
    const a = clamp(Number(val), 0, 100);
    setAlpha(a);
    emit(hex, a);
  };

  const grid = useMemo(buildGrid, []);
  const onPickFromGrid = (rgb) => apply(rgbToHex(rgb.r, rgb.g, rgb.b));
  const addCustom = () => {
    setCustomDots((prev) => {
      const next = [hex, ...prev.filter((x) => x !== hex)].slice(0, 6);
      return next;
    });
  };

  const startEyedropper = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPicking) return;

    if (typeof window === 'undefined' || typeof window.EyeDropper === 'undefined') {
      colorInputRef.current?.click();
      return;
    }

    try {
      setIsPicking(true);
      const ed = new window.EyeDropper();
      const { sRGBHex } = await ed.open();
      if (sRGBHex) apply(sRGBHex);
    } catch {
    } finally {
      setIsPicking(false);
    }
  };

  const onFallbackColorChange = (e) => {
    const val = e.target.value; // #rrggbb
    if (val) apply(val);
  };

  return (
    <Wrapper ref={ref}>
      <Trigger
        $color={hex}
        $alpha={alpha}
        onClick={() => setOpen((v) => !v)}
        aria-label="Выбрать цвет"
      />

      {open && (
        <Popover $placement={placement}>
          <Panel ref={panelRef}>
            <Head>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={startEyedropper}
                  title={
                    typeof window !== 'undefined' && typeof window.EyeDropper !== 'undefined'
                      ? 'Пипетка: выбрать цвет со страницы'
                      : 'Пипетка недоступна в этом браузере (используется встроенный выбор цвета)'
                  }
                  aria-label="Пипетка"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    border: '1px solid #dedee3',
                    background: isPicking ? '#eef0f5' : '#fff',
                    cursor: isPicking ? 'progress' : 'pointer',
                    padding: 0,
                  }}
                >
                  <img src={eyedropperIcon} alt="Eyedropper" width={12} height={12} />
                </button>

                <input
                  ref={colorInputRef}
                  type="color"
                  onChange={onFallbackColorChange}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: 0,
                    height: 0,
                  }}
                  tabIndex={-1}
                />

                <Title>{title}</Title>
              </div>
              <Close onClick={() => setOpen(false)}>✕</Close>
            </Head>

            <SelectFake readOnly value="Сетка" />

            <Grid $cols={grid.cols}>
              {grid.cells.map((cell) => (
                <GridCell
                  key={cell.id}
                  style={{ backgroundColor: `rgb(${cell.r},${cell.g},${cell.b})` }}
                  onClick={() => onPickFromGrid(cell)}
                />
              ))}
            </Grid>

            {withAlpha && (
              <>
                <SectionLabel>НЕПРОЗРАЧНОСТЬ</SectionLabel>
                <Row>
                  <Bar $rgb={rgb} value={alpha} onChange={(e) => handleAlpha(e.target.value)} />
                  <Percent>{alpha}%</Percent>
                </Row>
              </>
            )}

            <Dots>
              <Dot style={{ background: hex }} onClick={() => apply(hex)} />
              {DEFAULT_SWATCHES.map((c) => (
                <Dot key={c} onClick={() => apply(c)} title={c} style={{ background: c }}>
                  {c.toLowerCase() === hex.toLowerCase() ? <span /> : null}
                </Dot>
              ))}
              {customDots.map((c) => (
                <Dot key={`u-${c}`} onClick={() => apply(c)} title={c} style={{ background: c }}>
                  {c.toLowerCase() === hex.toLowerCase() ? <span /> : null}
                </Dot>
              ))}
              <PlusBtn onClick={addCustom}>+</PlusBtn>
            </Dots>

            <Footer>
              <HexInput
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                onBlur={() => apply(toHexAny(hex))}
                placeholder="#RRGGBB"
              />
            </Footer>

            <Tail $placement={placement} />
          </Panel>
        </Popover>
      )}
    </Wrapper>
  );
}
