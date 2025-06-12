"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calculator, X } from "lucide-react";
import { useEffect, useState } from "react";
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
    mesAno: z.string()
        .min(1, { message: "Mês/Ano é obrigatório" })
        .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, { message: "Formato deve ser MM/YYYY" }),
    taxaAnalise: z.number().min(0.01, { message: "Taxa de análise deve ser maior que 0,01%" }),
});

type FormData = z.infer<typeof formSchema>;

export function FormularioSerie() {
    const [taxaDisplay, setTaxaDisplay] = useState("0,00");
    const [mesAnoDisplay, setMesAnoDisplay] = useState("");
    const [taxa, setTaxa] = useState<number | null>(null);
    const [isProcedente, setIsProcedente] = useState<boolean>(false);
    const [maxTaxa, setMaxTaxa] = useState<string>("30");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedMaxTaxa = localStorage.getItem("maxTaxa");
            if (storedMaxTaxa) {
                setMaxTaxa(storedMaxTaxa);
            } else {
                toast.error("Não foi possível carregar as configurações");
            }
        }
    }, []);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            codigo: 0,
            descricao: "",
            mesAno: "",
            taxaAnalise: 0,
        },
    });

    const handleCalculate = async (data: FormData) => {
        try {
            // Converte mês/ano para datas inicial e final (formato MM/YYYY)
            const [month, year] = data.mesAno.split('/').map(Number);
            const dataInicial = new Date(year, month - 1, 1);
            const dataFinal = new Date(year, month, 0); // Último dia do mês

            const formatDate = (date: Date) => {
                return date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            };

            const apiUrl = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${data.codigo}/dados?formato=json&dataInicial=${formatDate(dataInicial)}&dataFinal=${formatDate(dataFinal)}`;
            const response = await axios.get(apiUrl);
            const taxaResponse: { data: string, valor: string }[] = response.data;

            if (taxaResponse.length === 0) {
                toast.error("Taxa não encontrada para o período selecionado");
                return;
            } else if (taxaResponse.length > 1) {
                toast.error("Mais de uma taxa encontrada para o período");
                return;
            }

            const taxaApi = parseFloat(taxaResponse[0].valor);
            setTaxa(taxaApi);

            const taxaLimite = taxaApi * (1 + Number(maxTaxa) / 100);
            setIsProcedente(data.taxaAnalise <= taxaLimite);

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Dados não encontrados no BACEN");
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

    const handleMesAnoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Remove tudo que não é número
        const numbersOnly = value.replace(/[^\d]/g, '');

        let formatted = numbersOnly;

        // Adiciona a barra após 2 dígitos
        if (numbersOnly.length >= 2) {
            formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 6);
        }

        // Limita a 7 caracteres (MM/YYYY)
        if (formatted.length > 7) {
            formatted = formatted.slice(0, 7);
        }

        setMesAnoDisplay(formatted);
        form.setValue('mesAno', formatted);
    };

    const handleClear = () => {
        form.reset({
            codigo: 0,
            descricao: "",
            mesAno: "",
            taxaAnalise: 0,
        });
        setTaxaDisplay("0,00");
        setMesAnoDisplay("");
        setTaxa(null);
        setIsProcedente(false);
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
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                                <FormField
                                    control={form.control}
                                    name="mesAno"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Mês/Ano</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="MM/YYYY"
                                                    value={mesAnoDisplay}
                                                    onChange={handleMesAnoChange}
                                                    maxLength={7}
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
        </Form>
    );
} 