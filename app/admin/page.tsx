import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavBar } from "@/components/nav-bar"

export default function AdminPage() {
  // Dados de exemplo para demonstração
  const pendingRequests = [
    {
      id: 1,
      schoolName: "Escola Municipal João da Silva",
      coordinator: "Maria Oliveira",
      workshopType: "Robótica",
      hours: 4,
      students: 25,
      date: "2025-04-15",
      startTime: "14:00",
      endTime: "18:00",
    },
    {
      id: 2,
      schoolName: "Escola Municipal Pedro Alves",
      coordinator: "José Santos",
      workshopType: "Programação",
      hours: 6,
      students: 30,
      date: "2025-04-20",
      startTime: "13:30",
      endTime: "19:30",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-iftm-lightGray">
      <NavBar isAdmin={true} />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-iftm-gray">Painel Administrativo</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-iftm-gray">Solicitações Pendentes</h2>

            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="border-t-4 border-t-iftm-green">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-iftm-gray">{request.schoolName}</CardTitle>
                          <CardDescription>Coordenador: {request.coordinator}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-iftm-green text-iftm-green">
                          Pendente
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Tipo de Oficina</p>
                          <p className="text-sm">{request.workshopType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Quantidade de Horas</p>
                          <p className="text-sm">{request.hours} horas</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Quantidade de Alunos</p>
                          <p className="text-sm">{request.students} alunos</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Data e Horário</p>
                          <p className="text-sm">
                            {request.date} das {request.startTime} às {request.endTime}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" className="border-iftm-red text-iftm-red hover:bg-red-50">
                        Recusar
                      </Button>
                      <Button className="bg-iftm-green hover:bg-iftm-darkGreen">Aprovar</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-t-4 border-t-iftm-green">
                <CardHeader>
                  <CardTitle className="text-iftm-gray">Nenhuma solicitação pendente</CardTitle>
                  <CardDescription>Não há solicitações de oficinas pendentes para aprovação.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

