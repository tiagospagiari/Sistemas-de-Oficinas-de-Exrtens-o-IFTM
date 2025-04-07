"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavBar } from "@/components/nav-bar";
import Link from "next/link";
import { Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuthCheck } from "@/components/auth-check";

export default function SchoolsPage() {
  // Dados de exemplo para demonstração
  const schools = [
    {
      id: 1,
      name: "Escola Municipal João da Silva",
      city: "Uberlândia",
      state: "MG",
      responsible: "Maria Oliveira",
    },
    {
      id: 2,
      name: "Escola Municipal Pedro Alves",
      city: "Uberaba",
      state: "MG",
      responsible: "José Santos",
    },
    {
      id: 3,
      name: "Escola Estadual Presidente Tancredo Neves",
      city: "Ituiutaba",
      state: "MG",
      responsible: "Ana Ferreira",
    },
  ];

  return (
    <AuthCheck>
      <div className="min-h-screen flex flex-col bg-iftm-lightGray">
        <NavBar />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-iftm-gray">
                Escolas Cadastradas
              </h1>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar escolas..."
                    className="pl-8 bg-white w-full sm:w-[250px]"
                  />
                </div>

                <Link href="/schools/register">
                  <Button className="bg-iftm-green hover:bg-iftm-darkGreen w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Cadastrar Nova Escola
                  </Button>
                </Link>
              </div>
            </div>

            {schools.length > 0 ? (
              <div className="grid gap-4">
                {schools.map((school) => (
                  <Card
                    key={school.id}
                    className="border-l-4 border-l-iftm-green"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-iftm-gray">
                            {school.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {school.city}, {school.state}
                          </p>
                          <p className="text-sm mt-1">
                            Responsável: {school.responsible}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-center">
                          <Button
                            variant="outline"
                            className="border-iftm-green text-iftm-green hover:bg-iftm-lightGreen"
                          >
                            Detalhes
                          </Button>
                          <Button
                            variant="outline"
                            className="border-iftm-green text-iftm-green hover:bg-iftm-lightGreen"
                          >
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-iftm-gray">
                    Nenhuma escola cadastrada
                  </CardTitle>
                  <CardDescription>
                    Não há escolas cadastradas no sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Link href="/schools/register">
                    <Button className="bg-iftm-green hover:bg-iftm-darkGreen">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Cadastrar Primeira Escola
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AuthCheck>
  );
}
