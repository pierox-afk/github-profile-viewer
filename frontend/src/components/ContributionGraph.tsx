'use client';

import { ContributionCalendar } from '@/types/user';

interface ContributionGraphProps {
  data: ContributionCalendar;
}

const LEVEL_COLORS = [
  '#161b22',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
];

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function ContributionGraph({ data }: ContributionGraphProps) {
  if (data.weeks.length === 0) {
    return null;
  }

  // Build the month labels row aligned with the first week of each month
  const monthMarkers: { index: number; label: string }[] = [];
  let lastMonth = -1;
  data.weeks.forEach((week, index) => {
    const firstDay = week[0];
    if (!firstDay) {
      return;
    }
    const month = new Date(firstDay.date).getUTCMonth();
    if (month !== lastMonth) {
      monthMarkers.push({ index, label: MONTH_LABELS[month] });
      lastMonth = month;
    }
  });

  return (
    <div className="rounded-md border border-border-default p-4">
      <h3 className="mb-3 text-sm text-fg-default">
        {data.totalContributions.toLocaleString('en-US')} contributions in the
        last year
      </h3>

      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="mb-1 flex text-xs text-fg-muted">
            {data.weeks.map((_, index) => {
              const marker = monthMarkers.find((m) => m.index === index);
              return (
                <div key={index} className="w-[13px] shrink-0">
                  {marker ? marker.label : ''}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {data.weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.count} contributions on ${day.date}`}
                    className="h-[10px] w-[10px] rounded-sm"
                    style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-fg-muted">
        <span>Less</span>
        {LEVEL_COLORS.map((color) => (
          <span
            key={color}
            className="h-[10px] w-[10px] rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
