import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

function Accordion({
  title,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className = '',
  contentClassName = '',
}) {
  const panelId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const panelInnerClasses = isOpen
    ? 'min-h-0 overflow-hidden border-t border-border px-4 py-4' // taste-skill-ignore: structural divider between trigger and open panel
    : 'min-h-0 overflow-hidden border-t-0 px-4 py-0';

  function toggle() {
    const nextOpen = !isOpen;
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  return (
    <section className={`overflow-hidden rounded-card border border-border bg-background ${className}`}>
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
          className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left font-semibold text-main transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span>{title}</span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`shrink-0 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        aria-hidden={!isOpen}
        inert={isOpen ? undefined : ''}
        className={`grid transition-[grid-template-rows,opacity] duration-[400ms] ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} ${contentClassName}`}
      >
        <div className={panelInnerClasses}>
          {children}
        </div>
      </div>
    </section>
  );
}

export default Accordion;
