"use client"

import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface ResultadoCardProps {
  taxaBase: number;
  taxaAnalise: number;
  isProcedente: boolean;
  labelTaxaBase?: string;
}

export function ResultadoCard({
  taxaBase,
  taxaAnalise,
  isProcedente,
  labelTaxaBase = "Taxa Base"
}: ResultadoCardProps) {
  const limite = taxaBase * 1.3;

  const porcentagemAcima = (taxaAnalise - limite) / limite * 100;

  return (
    <div className="space-y-4">
      {/* Resultado da análise */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-muted-foreground">{labelTaxaBase}</Label>
          <span className="text-lg font-semibold">{taxaBase.toFixed(2)}%</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <Label className="text-sm text-muted-foreground">Taxa Análise</Label>
          <span className="text-lg font-semibold flex items-center gap-1">
            {taxaAnalise.toFixed(2)}%
            {taxaAnalise > limite && (
              <span className="text-sm text-muted-foreground ml-1">
                (+{porcentagemAcima.toFixed(2)}%)
              </span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Label className="text-sm text-muted-foreground">Limite (30%)</Label>
          <span className="text-lg font-semibold">{limite.toFixed(2)}%</span>
        </div>
      </div>

      {/* Status da procedência */}
      <div className={`flex items-center justify-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${!isProcedente
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
        : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300'
        }`}>
        <div className={`p-1.5 rounded-full ${!isProcedente
          ? 'bg-emerald-100 dark:bg-emerald-900'
          : 'bg-rose-100 dark:bg-rose-900'
          }`}>
          {!isProcedente ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </div>
        <div className="text-center">
          <Label className="text-sm font-medium">
            Revisional {isProcedente ? 'improcedente' : 'procedente'}
          </Label>
          <p className="text-xs mt-0.5 opacity-80">
            {isProcedente
              ? 'Dentro do limite permitido'
              : 'Acima do limite de 30%'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 