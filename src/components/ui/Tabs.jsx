import { useId, useState } from 'react';

function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  className = '',
  tabClassName = '',
}) {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? tabs[0]?.id);
  const activeValue = value ?? internalValue;

  function selectTab(tab) {
    if (tab.disabled) return;
    if (value === undefined) setInternalValue(tab.id);
    onChange?.(tab.id);
  }

  return (
    <div role="tablist" className={`flex flex-wrap items-center gap-2 ${className}`}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          id={`${generatedId}-tab-${index}`}
          type="button"
          role="tab"
          aria-selected={activeValue === tab.id}
          disabled={tab.disabled}
          onClick={() => selectTab(tab)}
          className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${activeValue === tab.id ? 'border-primary bg-primary text-white' : 'border-border bg-white text-secondary hover:border-primary hover:text-primary'} ${tabClassName}`}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && tab.count !== null ? (
            <span className={`text-xs ${activeValue === tab.id ? 'text-white/80' : 'text-secondary'}`}>{tab.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
