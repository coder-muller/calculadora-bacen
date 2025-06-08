"use client"

import { ModeToggle } from "@/components/theme-toggle";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PercentCircle } from "lucide-react";
import { FormularioSerie } from "@/app/_components/formulario-serie";
import { FormularioJuros } from "@/app/_components/formulario-juros";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2">
          <PercentCircle className="w-7 h-7" />
          <Label className="text-xl font-bold">Calculadora de Taxas Contratuais</Label>
        </div>
      </div>
      <div className="absolute top-4 right-4">
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
