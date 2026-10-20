import { useEffect, useState } from 'react';
import { BookOpen, ClipboardList, MessagesSquare } from 'lucide-react';
import Notch from '../aceternity/Notch';

const tabOptions = [
  { id: 'materials', label: 'Materi', icon: <BookOpen size={14} /> },
  { id: 'tasks', label: 'Tugas', icon: <ClipboardList size={14} /> },
  { id: 'forum', label: 'Forum', icon: <MessagesSquare size={14} /> },
];

function MobileCourseTabs({ activeTab, onChange }) {
  const [visible, setVisible] = useState(true);

  // Hide near the footer so the fixed dock never covers the last links.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const nearBottom = window.scrollY + window.innerHeight
        >= document.documentElement.scrollHeight - 220;
      setVisible((current) => (current === !nearBottom ? current : !nearBottom));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const items = [{
    id: 'bagian',
    label: 'Bagian',
    value: activeTab,
    options: tabOptions,
    onChange: (optionId) => onChange(optionId),
  }];

  return (
    <div className="aceternity-notch-wrap md:hidden">
      {visible ? (
        <Notch
          items={items}
          position="bottom"
          offset={14}
          accentColor="var(--brand)"
          showDividers={false}
        />
      ) : null}
    </div>
  );
}

export default MobileCourseTabs;
