"use client"

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import seriesData from "@/lib/seriesData";

interface SerieComboboxProps {
  value?: string;
  onSerieSelect: (serie: { codigo: number; descricao: string }) => void;
  className?: string;
}

export function SerieCombobox({ value, onSerieSelect, className }: SerieComboboxProps) {
  const [open, setOpen] = useState(false);
  
  const selectedSerie = seriesData.find(s => s.descricao === value);

  const handleSerieSelect = (serie: typeof seriesData[0]) => {
    onSerieSelect(serie);
    setOpen(false);
  };

  return (
    <FormItem className={className}>
      <FormLabel>Série</FormLabel>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedSerie
                ? selectedSerie.descricao
                : "Selecione ou pesquise uma série..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
            <Command>
              <CommandInput placeholder="Pesquisar série..." />
              <CommandEmpty>Nenhuma série encontrada.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {seriesData.map((serie) => (
                    <CommandItem
                      key={serie.codigo}
                      value={`${serie.codigo} ${serie.descricao}`}
                      onSelect={() => handleSerieSelect(serie)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSerie?.codigo === serie.codigo ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{serie.descricao}</span>
                        <span className="text-muted-foreground text-xs">{serie.codigo}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
} 