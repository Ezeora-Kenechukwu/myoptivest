// @ts-nocheck
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subWeeks, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type DateRange = {
  from?: Date;
  to?: Date;
};

type DateRangePickerProps = {
  onUpdate?: (range: { current: DateRange; compare?: DateRange }) => void;
  initialDateFrom?: string | Date;
  initialDateTo?: string | Date;
  range?: boolean;
  showCompare?: boolean;
  align?: "start" | "center" | "end";
};

export function DateRangePicker({
  onUpdate,
  initialDateFrom,
  initialDateTo,
  range = true,
  showCompare = true,
  align = "start",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<DateRange>(() => ({
    from: initialDateFrom ? new Date(initialDateFrom) : undefined,
    to: initialDateTo ? new Date(initialDateTo) : undefined,
  }));

  const [compareRange, setCompareRange] = React.useState<DateRange>();
  const [compare, setCompare] = React.useState(false);

  const handlePreset = (from: Date, to: Date) => {
    setSelectedRange({ from, to });
    onUpdate?.({ current: { from, to }, compare: compare ? compareRange : undefined });
    setOpen(false);
  };

  const displayLabel = () => {
    if (range && selectedRange?.from) {
      const from = selectedRange.from.toLocaleDateString();
      const to = selectedRange.to ? selectedRange.to.toLocaleDateString() : "…";
      return `${from} – ${to}`;
    }
    return "Select date range";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-fit justify-start text-left font-normal",
            !selectedRange?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayLabel()}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4 space-y-4 overflow-auto max-h-[600px] max-w-[500px]" align={align}>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" onClick={() => handlePreset(new Date(), new Date())}>
            Today
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handlePreset(subDays(new Date(), 1), subDays(new Date(), 1))}>
            Yesterday
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handlePreset(subDays(new Date(), 6), new Date())}>
            Last 7 Days
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handlePreset(subDays(new Date(), 13), new Date())}>
            Last 14 Days
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handlePreset(subDays(new Date(), 29), new Date())}>
            Last 30 Days
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handlePreset(startOfWeek(new Date()), endOfWeek(new Date()))}>
            This Week
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handlePreset(startOfWeek(subWeeks(new Date(), 1)), endOfWeek(subWeeks(new Date(), 1)))}>
            Last Week
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handlePreset(startOfMonth(new Date()), endOfMonth(new Date()))}>
            This Month
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handlePreset(startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1)))}>
            Last Month
          </Button>
        </div>

        <div className="border-t pt-4">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={(v) => {
              setSelectedRange(v || {});
            }}
            numberOfMonths={2}
          />
        </div>

        {showCompare && (
          <div className="flex items-center gap-3 pt-3 border-t">
            <Switch checked={compare} onCheckedChange={setCompare} id="compare" />
            <Label htmlFor="compare">Compare to previous period</Label>
          </div>
        )}

        {compare && (
          <div className="pt-2">
            <Calendar
              mode="range"
              selected={compareRange}
              onSelect={(v) => setCompareRange(v || {})}
              numberOfMonths={2}
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => {
              onUpdate?.({ current: selectedRange, compare: compare ? compareRange : undefined });
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
