"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  options: { value: any; label: string }[];
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
  onSearch?: (value: string) => void;
  shouldFilter?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  emptyMessage = "Nenhum resultado encontrado.",
  className,
  loading = false,
  onSearch,
  shouldFilter = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const handleInputChange = React.useCallback(
    (value: string) => {
      setInputValue(value);

      if (value.length >= 3 && onSearch) {
        onSearch(value);
      }
    },
    [onSearch],
  );

  const clearSearch = () => {
    setInputValue("");
  };

  // Encontrar a opção selecionada
  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom">
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            placeholder={`Buscar ${placeholder.toLowerCase()}...`}
            value={inputValue}
            onValueChange={handleInputChange}
          />
          {loading ? (
            <div className="py-6 text-center text-sm">Carregando...</div>
          ) : (
            <CommandList>
              {options.length === 0 ? (
                <CommandEmpty>
                  {inputValue.length >= 5
                    ? emptyMessage
                    : "Digite pelo menos 5 caracteres para buscar..."}
                </CommandEmpty>
              ) : (
                <CommandGroup className="max-h-60 overflow-auto">
                  {options.map((option) => (
                    <div
                      onClick={() => {
                        onChange(option.value);
                        clearSearch();
                        setOpen(false);
                      }}
                      key={String(option.value)}
                      className="cursor-pointer"
                    >
                      <CommandItem
                        value={option.label}
                        // value={option.value}
                        onSelect={() => {
                          onChange(option.value);
                          clearSearch();
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    </div>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
