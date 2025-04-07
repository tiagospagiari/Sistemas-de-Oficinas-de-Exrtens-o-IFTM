"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavBar } from "@/components/nav-bar";
import Link from "next/link";
import { AuthCheck } from "@/components/auth-check";

export default function Dashboard() {
  return (
    <AuthCheck>
      <div className="min-h-screen flex flex-col bg-iftm-lightGray">
        <NavBar />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-iftm-gray">
              Painel de Controle
            </h1>

            <Tabs defaultValue="pending">
              <TabsList className="mb-4 bg-white border border-iftm-green/20">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-iftm-green data-[state=active]:text-white"
                >
                  Solicitações Pendentes
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-iftm-green data-[state=active]:text-white"
                >
                  Solicitações Aprovadas
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-iftm-green data-[state=active]:text-white"
                >
                  Oficinas Realizadas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                <Card className="border-t-4 border-t-iftm-green">
                  <CardHeader>
                    <CardTitle className="text-iftm-gray">
                      Nenhuma solicitação pendente
                    </CardTitle>
                    <CardDescription>
                      Você não possui solicitações de oficinas pendentes no
                      momento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/request">
                      <Button className="bg-iftm-green hover:bg-iftm-darkGreen">
                        Nova Solicitação
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                <Card className="border-t-4 border-t-iftm-green">
                  <CardHeader>
                    <CardTitle className="text-iftm-gray">
                      Nenhuma solicitação aprovada
                    </CardTitle>
                    <CardDescription>
                      Você não possui solicitações de oficinas aprovadas no
                      momento.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <Card className="border-t-4 border-t-iftm-green">
                  <CardHeader>
                    <CardTitle className="text-iftm-gray">
                      Nenhuma oficina realizada
                    </CardTitle>
                    <CardDescription>
                      Você não possui oficinas realizadas que necessitem de
                      avaliação.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AuthCheck>
  );
}
