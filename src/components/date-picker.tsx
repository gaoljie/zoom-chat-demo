import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";

const DatePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label: string;
}) => {
  return (
    <FormField
      {...props}
      render={({ field }) => {
        return (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel className="text-right">{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      dayjs(field.value).format("YYYY-MM-DD")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(value) => {
                    field.onChange(dayjs(value).toString());
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        );
      }}
    />
  );
};

export default DatePicker;
