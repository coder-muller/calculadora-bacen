"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { SerieCombobox } from "./serie-combobox";
import { ResultadoCard } from "./resultado-card";
import seriesData from "@/lib/seriesData";

const formSchema = z.object({
  codigo: z.number().min(1, { message: "Código é obrigatório" }),
  descricao: z.string().min(1, { message: "Descrição é obrigatória" }),
  dataInicial: z.date({ message: "Data inicial é obrigatória" }),
  dataFinal: z.date({ message: "Data final é obrigatória" }),
  taxaAnalise: z.number().min(0.01, { message: "Taxa de análise deve ser maior que 0,01%" }),
}).refine((data) => data.dataInicial <= data.dataFinal, {
  message: "Data inicial deve ser anterior ou igual à data final",
  path: ["dataFinal"],
});

type FormData = z.infer<typeof formSchema>;

export function FormularioSerie() {
  const [taxaDisplay, setTaxaDisplay] = useState("0,00");
  const [taxa, setTaxa] = useState<number | null>(null);
  const [isProcedente, setIsProcedente] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: 0,
      descricao: "",
      dataInicial: new Date(),
      dataFinal: new Date(),
      taxaAnalise: 0,
    },
  });

  const handleCalculate = async (data: FormData) => {
    try {
      const apiUrl = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${data.codigo}/dados?formato=json&dataInicial=${data.dataInicial.toISOString().split('T')[0].split('-').reverse().join('/')}&dataFinal=${data.dataFinal.toISOString().split('T')[0].split('-').reverse().join('/')}`;
      const response = await axios.get(apiUrl);
      const taxaResponse: { data: string, valor: string }[] = response.data;

      if (taxaResponse.length === 0) {
        toast.error("Taxa não encontrada");
        return;
      } else if (taxaResponse.length > 1) {
        toast.error("Mais de uma taxa encontrada");
        return;
      }

      const taxaApi = parseFloat(taxaResponse[0].valor);
      setTaxa(taxaApi);

      const taxaLimite = taxaApi * 1.3;
      setIsProcedente(data.taxaAnalise <= taxaLimite);

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Erro ao calcular a taxa");
      }
      console.log(error);
    }
  };

  const handleCodigoChange = (codigo: number) => {
    const serie = seriesData.find(s => s.codigo === codigo);
    if (serie) {
      form.setValue('codigo', codigo);
      form.setValue('descricao', serie.descricao);
    } else {
      form.setValue('codigo', codigo);
      if (codigo === 0) {
        form.setValue('descricao', "");
      }
    }
  };

  const handleSerieSelect = (selectedSerie: { codigo: number; descricao: string }) => {
    form.setValue('codigo', selectedSerie.codigo);
    form.setValue('descricao', selectedSerie.descricao);
  };

  const handleTaxaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbersOnly = value.replace(/[^\d]/g, '');
    
    if (numbersOnly === '') {
      setTaxaDisplay("0,00");
      form.setValue('taxaAnalise', 0);
      return;
    }

    const numericValue = parseInt(numbersOnly) / 100;
    
    const formatted = numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    setTaxaDisplay(formatted);
    form.setValue('taxaAnalise', numericValue);
  };



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-9 gap-2">
              <div className="flex flex-col col-span-2">
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Código"
                          value={field.value || ''}
                          onChange={(e) => {
                            const codigo = parseInt(e.target.value) || 0;
                            handleCodigoChange(codigo);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col col-span-7">
                <SerieCombobox
                  value={form.watch('descricao')}
                  onSerieSelect={handleSerieSelect}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="dataInicial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Inicial</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Data Inicial"
                          value={field.value && new Date(field.value).getTime() > 0 ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="dataFinal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Final</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Data Final"
                          value={field.value && new Date(field.value).getTime() > 0 ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="taxaAnalise"
                  render={() => (
                    <FormItem>
                      <FormLabel>Taxa de análise (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Digite: 547 = 5,47%"
                          value={taxaDisplay}
                          onChange={handleTaxaChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {/* Resultado da análise */}
            {taxa && (
              <ResultadoCard
                taxaBase={taxa}
                taxaAnalise={form.watch('taxaAnalise')}
                isProcedente={isProcedente}
                labelTaxaBase="Taxa BACEN"
              />
            )}

            {/* Botão de calcular */}
            <div className="flex justify-end">
              <Button type="submit" variant="default" size="lg" className="min-w-32">
                <Calculator className="w-4 h-4 mr-2" />
                Calcular
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
} 