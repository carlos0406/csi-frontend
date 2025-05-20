"use client";
import type React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createPurchase } from "@/utils/api";

export default function NovaCompra() {
  const { toast } = useToast();
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Nome deve ter pelo menos 2 caracteres",
    }),
    startDate: z.string().min(10, {
      message: "Data de início é obrigatória",
    }),
    endDate: z.string().min(10, {
      message: "Data de fim é obrigatória",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });

  const { push } = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createPurchase(values);
    toast({
      title: "Compra criada com sucesso!",
      description: "Sua compra foi registrada.",
      color: "error",
    });
    push("/compras");
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Nova Compra</h1>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Compra</Label>
                  <Input
                    id="nome"
                    placeholder="COMPRA DE ABRIL 23"
                    required
                    {...field}
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data Início</Label>
                  <div className="relative">
                    <Input type="date" {...field} />
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <div className="relative">
                    <Input type="date" {...field} />
                  </div>
                </div>
              )}
            />

            <Button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white w-full sm:w-auto h-12 sm:h-10"
            >
              Criar Compra
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
