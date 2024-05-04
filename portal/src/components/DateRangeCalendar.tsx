import { RangeCalendar, RangeCalendarProps } from "@nextui-org/react";
import React from "react";

interface DateRangeCalendarProps extends RangeCalendarProps {}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const DateRangeCalendar: React.FC<DateRangeCalendarProps> = React.forwardRef(
  (props, ref) => (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <div ref={ref} className={props.className}>
      <RangeCalendar
        {...props}
        className="hidden sm:inline-block"
        visibleMonths={2}
      />
      <RangeCalendar
        {...props}
        className="sm:hidden inline-block"
        visibleMonths={1}
      />
    </div>
  ),
);

export default DateRangeCalendar;
