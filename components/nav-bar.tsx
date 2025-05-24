"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface NavBarProps {
  isAdmin?: boolean;
}

export function NavBar({ isAdmin = false }: NavBarProps) {
  const { logout, userData } = useAuth();
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
    if (!userData?.email) return userData?.role === "admin" ? "AD" : "US";

    const emailParts = userData.email.split("@")[0].split(".");
    if (emailParts.length >= 2) {
      return (emailParts[0][0] + emailParts[1][0]).toUpperCase();
    }
    return userData.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-iftm-green/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href={userData?.role === "admin" ? "/dashboard" : "/dashboard"}
            >
              <Image
                src="/images/logo-iftm.png"
                alt="Logo IFTM"
                width={60}
                height={60}
              />
            </Link>

            <nav className="ml-10 flex items-center space-x-4">
              {userData?.role === "admin" ? (
                <>
                  <Link
                    href="/solicitacoes"
                    className="text-iftm-gray hover:text-iftm-green px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Solicitações
                  </Link>
                  <Link
                    href="/solicitacoes/reports"
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
                    href={`/schools/${userData?.schoolId}`}
                    className="text-iftm-gray hover:text-iftm-green px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Minha Escola
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
                      src="https://github.com/shadcn.png"
                      alt="Avatar"
                    />
                    <AvatarFallback className="bg-iftm-green text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col gap-1 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData?.displayName
                        ? userData?.displayName
                        : "Representante"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-iftm-green/20 text-iftm-green">
                      {userData?.role === "admin"
                        ? "Administrador"
                        : userData?.role === "school_representative"
                        ? "Representante Escolar"
                        : "Usuário"}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
