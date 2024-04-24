import { Cross1Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  className: string;
}

const TagsInput = ({ value, onChange, className }: TagsInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={cn("space-y-2", className)}>
      <Input
        ref={inputRef}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" && inputRef.current) {
            e.preventDefault();
            onChange([...value, inputRef.current.value]);
            inputRef.current.value = "";
          }
        }}
      />
      <div className="space-x-3">
        {value.map((item) => (
          <Badge key={item} className="space-x-2">
            <span>{item}</span>
            <button
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
            >
              <Cross1Icon className="h-4 w-4 hover:text-gray-300" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export { TagsInput };
