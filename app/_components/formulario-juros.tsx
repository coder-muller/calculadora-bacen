"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calculator, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResultadoCard } from "./resultado-card";

const formSchema = z.object({
    taxaBase: z.number().min(0.01, { message: "Taxa base deve ser maior que 0,01%" }),
    taxaAnalise: z.number().min(0.01, { message: "Taxa de análise deve ser maior que 0,01%" }),
});

type FormData = z.infer<typeof formSchema>;

export function FormularioJuros() {
    const [taxaBaseDisplay, setTaxaBaseDisplay] = useState("0,00");
    const [taxaAnaliseDisplay, setTaxaAnaliseDisplay] = useState("0,00");
    const [resultado, setResultado] = useState<{
        taxaBase: number;
        taxaAnalise: number;
        isProcedente: boolean;
    } | null>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            taxaBase: 0,
            taxaAnalise: 0,
        },
    });

    const handleCalculate = (data: FormData) => {
        const taxaLimite = data.taxaBase * 1.3; // 30% a mais que a taxa base
        const isProcedente = data.taxaAnalise <= taxaLimite;

        setResultado({
            taxaBase: data.taxaBase,
            taxaAnalise: data.taxaAnalise,
            isProcedente,
        });
    };

    const handleTaxaBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numbersOnly = value.replace(/[^\d]/g, '');

        if (numbersOnly === '') {
            setTaxaBaseDisplay("0,00");
            form.setValue('taxaBase', 0);
            return;
        }

        const numericValue = parseInt(numbersOnly) / 100;

        const formatted = numericValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        setTaxaBaseDisplay(formatted);
        form.setValue('taxaBase', numericValue);
    };

    const handleTaxaAnaliseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numbersOnly = value.replace(/[^\d]/g, '');

        if (numbersOnly === '') {
            setTaxaAnaliseDisplay("0,00");
            form.setValue('taxaAnalise', 0);
            return;
        }

        const numericValue = parseInt(numbersOnly) / 100;

        const formatted = numericValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        setTaxaAnaliseDisplay(formatted);
        form.setValue('taxaAnalise', numericValue);
    };

    const handleClear = () => {
        form.reset({
            taxaBase: 0,
            taxaAnalise: 0,
        });
        setTaxaBaseDisplay("0,00");
        setTaxaAnaliseDisplay("0,00");
        setResultado(null);
    };



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <FormField
                                    control={form.control}
                                    name="taxaBase"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Taxa Base (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Digite: 150 = 1,50%"
                                                    value={taxaBaseDisplay}
                                                    onChange={handleTaxaBaseChange}
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
                                            <FormLabel>Taxa de Análise (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Digite: 200 = 2,00%"
                                                    value={taxaAnaliseDisplay}
                                                    onChange={handleTaxaAnaliseChange}
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
                        {resultado && (
                            <ResultadoCard
                                taxaBase={resultado.taxaBase}
                                taxaAnalise={resultado.taxaAnalise}
                                isProcedente={resultado.isProcedente}
                                labelTaxaBase="Taxa Base"
                            />
                        )}

                        {/* Botão de calcular */}
                        <div className="flex items-center justify-end gap-2">
                            <Button type="submit" variant="default" className="min-w-32">
                                <Calculator className="w-4 h-4 mr-2" />
                                Calcular
                            </Button>
                            <Button type="button" variant="outline" onClick={handleClear}>
                                <X className="w-4 h-4 mr-2" />
                                Limpar
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form >
    );
} 