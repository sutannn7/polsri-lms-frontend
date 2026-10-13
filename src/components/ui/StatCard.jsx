import Card from './Card';

function StatCard({ icon, label, value, detail, className = '' }) {
  return (
    <Card className={`flex items-center gap-4 p-5 ${className}`}>
      {icon ? (
        <span aria-hidden="true" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-sm text-secondary">{label}</p>
        <p className="mt-1 text-xl font-bold text-main">{value}</p>
        {detail ? <p className="mt-1 text-xs text-secondary">{detail}</p> : null}
      </div>
    </Card>
  );
}

export default StatCard;
