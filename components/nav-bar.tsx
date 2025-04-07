"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface NavBarProps {
  isAdmin?: boolean;
}

export function NavBar({ isAdmin = false }: NavBarProps) {
  const { logout, user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair do sistema.",
        variant: "destructive",
      });
    }
  };

  // Obter as iniciais do email do usuário para o avatar
  const getUserInitials = () => {
    if (!user?.email) return isAdmin ? "AD" : "US";

    const emailParts = user.email.split("@")[0].split(".");
    if (emailParts.length >= 2) {
      return (emailParts[0][0] + emailParts[1][0]).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-iftm-green/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={isAdmin ? "/admin" : "/dashboard"}>
              <Image
                src="/images/logo-iftm.png"
                alt="Logo IFTM"
                width={150}
                height={60}
              />
            </Link>

            <nav className="ml-10 flex items-center space-x-4">
              {isAdmin ? (
                <>
                  <Link
                    href="/admin"
                    className="text-iftm-gray hover:text-iftm-green px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Solicitações
                  </Link>
                  <Link
                    href="/admin/reports"
                    className="text-iftm-gray hover:text-iftm-green px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Relatórios
                  </Link>
                  <Link
                    href="/schools"
                    className="text-iftm-gray hover:text-iftm-green px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Escolas
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="text-iftm-gray hover:text-iftm-green px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/request"
                    className="text-iftm-gray hover:text-iftm-green px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Nova Solicitação
                  </Link>
                  <Link
                    href="/schools"
                    className="text-iftm-gray hover:text-iftm-green px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Escolas
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Avatar"
                    />
                    <AvatarFallback className="bg-iftm-green text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-sm text-muted-foreground"
                  disabled
                >
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
