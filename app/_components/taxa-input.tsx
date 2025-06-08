"use client"

import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

interface TaxaInputProps {
  label: string;
  placeholder?: string;
  onTaxaChange: (taxa: number) => void;
  className?: string;
}

export function TaxaInput({ label, placeholder = "Digite: 547 = 5,47%", onTaxaChange, className }: TaxaInputProps) {
  const [taxaDisplay, setTaxaDisplay] = useState("0,00");

  const handleTaxaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbersOnly = value.replace(/[^\d]/g, '');
    
    if (numbersOnly === '') {
      setTaxaDisplay("0,00");
      onTaxaChange(0);
      return;
    }

    const numericValue = parseInt(numbersOnly) / 100;
    
    const formatted = numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    setTaxaDisplay(formatted);
    onTaxaChange(numericValue);
  };

  const resetTaxa = () => {
    setTaxaDisplay("0,00");
    onTaxaChange(0);
  };

  return {
    component: (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder={placeholder}
            value={taxaDisplay}
            onChange={handleTaxaChange}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    resetTaxa
  };
} 