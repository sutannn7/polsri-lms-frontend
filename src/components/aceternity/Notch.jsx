import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import '../../styles/notch.css';

const SHELL_SPRING = { type: 'spring', stiffness: 380, damping: 34 };

const LIST_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { opacity: { duration: 0.15 }, staggerChildren: 0.045, delayChildren: 0.08 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const OPTION_VARIANTS = {
  hidden: { opacity: 0, y: -10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 420, damping: 30 },
  },
};

function NotchDivider() {
  return <span aria-hidden="true" className="aceternity-notch-divider" />;
}

// Port of Aceternity's Notch. Adds focus return and arrow-key navigation to the
// upstream listbox so the floating control is usable without a pointer.
export default function Notch({
  items,
  position = 'bottom',
  align = 'center',
  onItemChange,
  closeOnSelect = true,
  showSelectedValue = true,
  showDividers = true,
  accentColor = '#0056B3',
  offset = 16,
  reveal = true,
  className = '',
  itemClassName = '',
  panelClassName = '',
}) {
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRefs = useRef({});
  const pendingFocusRef = useRef(null);
  const shellLayoutId = useId();
  const reduceMotion = useReducedMotion();
  const [openItemId, setOpenItemId] = useState(null);
  const [internalSelected, setInternalSelected] = useState(() => {
    const map = {};
    for (const item of items) {
      if (item.value === undefined) {
        map[item.id] = item.defaultValue ?? item.options[0]?.id ?? '';
      }
    }
    return map;
  });

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') setOpenItemId(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!openItemId) return undefined;
    function onPointerDown(event) {
      if (!shellRef.current?.contains(event.target)) setOpenItemId(null);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [openItemId]);

  const getSelectedId = (item) => (
    item.value ?? internalSelected[item.id] ?? item.options[0]?.id
  );

  const getSelectedOption = (item) => (
    item.options.find((option) => option.id === getSelectedId(item))
  );

  const handleSelect = (item, option) => {
    if (item.value === undefined) {
      setInternalSelected((previous) => ({ ...previous, [item.id]: option.id }));
    }
    item.onChange?.(option.id, option);
    onItemChange?.(item.id, option.id, option);
    if (closeOnSelect) {
      pendingFocusRef.current = item.id;
      setOpenItemId(null);
    }
  };

  function handlePanelKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      pendingFocusRef.current = openItem.id;
      setOpenItemId(null);
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const options = [...(panelRef.current?.querySelectorAll('.aceternity-notch-option') ?? [])];
    if (!options.length) return;
    event.preventDefault();
    const current = options.indexOf(document.activeElement);
    const next = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? options.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    options[next]?.focus();
  }

  const alignClass = align === 'start' ? 'is-start' : align === 'end' ? 'is-end' : 'is-center';
  const edgeOffset = (offset + 20) * (position === 'top' ? -1 : 1);
  const openItem = items.find((item) => item.id === openItemId) ?? null;

  const optionsPanel = openItem ? (
    <motion.div
      key={openItem.id}
      ref={(node) => {
        panelRef.current = node;
        if (!node) return;
        const active = node.querySelector('[aria-selected="true"]')
          ?? node.querySelector('.aceternity-notch-option');
        window.requestAnimationFrame(() => active?.focus());
      }}
      role="listbox"
      aria-label={typeof openItem.label === 'string' ? openItem.label : openItem.id}
      variants={reduceMotion ? undefined : LIST_VARIANTS}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion ? undefined : 'visible'}
      exit={reduceMotion ? undefined : 'exit'}
      onKeyDown={handlePanelKeyDown}
      className={`aceternity-notch-panel ${panelClassName}`.trim()}
    >
      {openItem.options.map((option) => {
        const active = option.id === getSelectedId(openItem);
        return (
          <motion.button
            key={option.id}
            type="button"
            role="option"
            aria-selected={active}
            variants={reduceMotion ? undefined : OPTION_VARIANTS}
            onClick={() => handleSelect(openItem, option)}
            className={`aceternity-notch-option${active ? ' is-active' : ''}`}
          >
            <span className="aceternity-notch-option-label">
              {option.icon ? (
                <span className="aceternity-notch-option-icon" aria-hidden="true">
                  {option.icon}
                </span>
              ) : null}
              <span>{option.label}</span>
            </span>
            {active ? <span className="aceternity-notch-dot" aria-hidden="true" /> : null}
          </motion.button>
        );
      })}
    </motion.div>
  ) : (
    <motion.div
      key="__notch-triggers"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.15 }}
      className="aceternity-notch-triggers"
    >
      {items.map((item, index) => {
        const selected = getSelectedOption(item);
        return (
          <Fragment key={item.id}>
            <button
              ref={(node) => {
                triggerRefs.current[item.id] = node;
                if (node && pendingFocusRef.current === item.id) {
                  pendingFocusRef.current = null;
                  node.focus();
                }
              }}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={false}
              onClick={() => {
                pendingFocusRef.current = null;
                setOpenItemId(item.id);
              }}
              className={`aceternity-notch-trigger ${itemClassName}`.trim()}
            >
              {item.icon ? (
                <span className="aceternity-notch-trigger-icon" aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              <span className="aceternity-notch-trigger-label">{item.label}</span>
              {(item.showValue ?? showSelectedValue) && selected ? (
                <span className="aceternity-notch-trigger-value">{selected.label}</span>
              ) : null}
            </button>
            {showDividers && index < items.length - 1 ? <NotchDivider /> : null}
          </Fragment>
        );
      })}
    </motion.div>
  );

  return (
    <div
      className={`aceternity-notch is-${position} ${alignClass} ${className}`.trim()}
      style={position === 'top'
        ? { paddingTop: `max(${offset}px, env(safe-area-inset-top))` }
        : { paddingBottom: `max(${offset}px, env(safe-area-inset-bottom))` }}
    >
      <motion.div
        ref={shellRef}
        layout={!reduceMotion}
        layoutId={shellLayoutId}
        initial={reveal && !reduceMotion ? { opacity: 0, y: edgeOffset, filter: 'blur(6px)' } : false}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={reduceMotion ? { duration: 0 } : SHELL_SPRING}
        className="aceternity-notch-shell"
        style={{ '--notch-accent': accentColor }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {optionsPanel}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
