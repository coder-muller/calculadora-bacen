"use client"

import { ModeToggle } from "@/components/theme-toggle";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PercentCircle, Settings } from "lucide-react";
import { FormularioSerie } from "@/app/_components/formulario-serie";
import { FormularioJuros } from "@/app/_components/formulario-juros";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PopoverClose } from "@radix-ui/react-popover";

export default function Home() {
  const [maxTaxa, setMaxTaxa] = useState<string>("30");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const maxTaxa = localStorage.getItem("maxTaxa");
      if (maxTaxa) {
        setMaxTaxa(maxTaxa);
      } else {
        localStorage.setItem("maxTaxa", "30");
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2">
          <PercentCircle className="w-7 h-7" />
          <Label className="text-xl font-bold">Calculadora de Taxas Contratuais</Label>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Popover>
          <PopoverTrigger>
            <Button>
              <Settings />
              {maxTaxa}%
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-4">
              <Label>Configurações</Label>
              <div className="grid grid-cols-2 gap-2">
                <Label>% Máxima</Label>
                <Input type="text" value={maxTaxa} onChange={(e) => setMaxTaxa(e.target.value)} />
              </div>
              <PopoverClose asChild>
                <Button onClick={() => {
                  localStorage.setItem("maxTaxa", maxTaxa);
                  toast.success("Configurações salvas com sucesso");
                }}>
                  Salvar
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
        <ModeToggle />
      </div>

      <Card className="hidden lg:block w-full max-w-5xl">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Calculadora de Taxas Contratuais</CardTitle>
            <CardDescription>Calcule a validade contratual de acordo com a taxa do BACEN.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <Tabs defaultValue="serie" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="serie">Calcular com a Série</TabsTrigger>
              <TabsTrigger value="juros">Calcular com a Taxa</TabsTrigger>
            </TabsList>

            <TabsContent value="serie">
              <FormularioSerie />
            </TabsContent>

            <TabsContent value="juros">
              <FormularioJuros />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 right-4">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          Feito com ❤️ por <a href="https://github.com/coder-muller" target="_blank" rel="noopener noreferrer" className="hover:underline">Guilherme Müller</a>
        </Label>
      </div>
    </div>
  );
}
