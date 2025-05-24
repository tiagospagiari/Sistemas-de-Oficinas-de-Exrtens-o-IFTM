"use client";

import { useEffect, useState } from "react";
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
import { SchoolService } from "@/lib/services/schoolService";
import { School } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function SchoolsPage() {
  const { toast } = useToast();
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const activeSchools = await SchoolService.getSchoolsByStatus("active");
        setSchools(activeSchools);
      } catch (error) {
        console.error("Erro ao carregar escolas:", error);
        toast({
          title: "Erro ao carregar escolas",
          description: "Não foi possível carregar a lista de escolas. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSchools();
  }, [toast]);

  const filteredSchools = schools.filter((school) =>
    school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Carregando escolas...</p>
                </CardContent>
              </Card>
            ) : filteredSchools.length > 0 ? (
              <div className="grid gap-4">
                {filteredSchools.map((school) => (
                  <Card
                    key={school.id}
                    className="border-l-4 border-l-iftm-green"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-iftm-gray">
                            {school.schoolName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {school.city}, {school.state}
                          </p>
                          <p className="text-sm mt-1">
                            Email: {school.email}
                          </p>
                          <p className="text-sm">
                            Telefone: {school.phone}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-center">
                          <Button
                            variant="outline"
                            className="border-iftm-green text-iftm-green hover:bg-iftm-lightGreen"
                            onClick={() => window.location.href = `/schools/${school.id}`}
                          >
                            Detalhes
                          </Button>
                          <Button
                            variant="outline"
                            className="border-iftm-green text-iftm-green hover:bg-iftm-lightGreen"
                            onClick={() => window.location.href = `/schools/${school.id}/edit`}
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
                    {searchTerm ? "Nenhuma escola encontrada" : "Nenhuma escola cadastrada"}
                  </CardTitle>
                  <CardDescription>
                    {searchTerm
                      ? "Não há escolas que correspondam à sua busca."
                      : "Não há escolas cadastradas no sistema."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Link href="/schools/register">
                    <Button className="bg-iftm-green hover:bg-iftm-darkGreen">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {searchTerm ? "Limpar busca" : "Cadastrar Primeira Escola"}
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
