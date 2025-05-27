"use client"

import { WorkshopRequest } from './workshopRequestService';
import { AuthService } from './authService';
import { SchoolService } from './schoolService';

export class EmailService {
  static async sendWorkshopRequestEmail(request: WorkshopRequest) {
    try {
      // Buscar dados da escola
      const school = await SchoolService.getSchoolById(request.schoolId);
      if (!school) {
        throw new Error('Escola não encontrada');
      }

      // Buscar dados do representante
      const representative = await AuthService.getUserData(request.representativeId);
      if (!representative) {
        throw new Error('Representante não encontrado');
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'extensao.upt@iftm.edu.br',
          subject: `Nova Solicitação de Oficina - ${request.schoolName}`,
          html: `
            <h2>Nova Solicitação de Oficina</h2>
            
            <h3>Dados da Escola</h3>
            <p><strong>Escola:</strong> ${request.schoolName}</p>
            <p><strong>Endereço:</strong> ${school.address}</p>
            <p><strong>Cidade/UF:</strong> ${school.city} - ${school.state}</p>
            <p><strong>CEP:</strong> ${school.zipCode}</p>
            <p><strong>Telefone:</strong> ${school.phone}</p>
            <p><strong>Email Institucional:</strong> ${school.email}</p>

            <h3>Dados do Representante</h3>
            <p><strong>Nome:</strong> ${representative.displayName}</p>
            <p><strong>Email:</strong> ${representative.email}</p>
            <p><strong>Telefone:</strong> ${representative.phone || 'Não informado'}</p>

            <h3>Detalhes da Oficina</h3>
            <p><strong>Coordenador:</strong> ${request.coordinator}</p>
            <p><strong>Horas:</strong> ${request.hours}</p>
            <p><strong>Número de Alunos:</strong> ${request.students}</p>
            <p><strong>Tipo de Oficina:</strong> ${request.workshopType}</p>
            <p><strong>Nível de Ensino:</strong> ${request.educationLevel.map(level => 
              level === 'fundamental' ? 'Ensino Fundamental' :
              level === 'medio' ? 'Ensino Médio' :
              'Ensino Superior'
            ).join(', ')}</p>
            <p><strong>Dias Disponíveis:</strong> ${request.availableDays.map(day => 
              day === 'segunda' ? 'Segunda' :
              day === 'terca' ? 'Terça' :
              day === 'quarta' ? 'Quarta' :
              day === 'quinta' ? 'Quinta' :
              'Sexta'
            ).join(', ')}</p>
            ${request.workshopDescription ? `<p><strong>Descrição da Oficina:</strong> ${request.workshopDescription}</p>` : ''}
            <p><strong>Descrição Adicional:</strong> ${request.otherDescription || 'Não informada'}</p>
            <p><strong>Materiais Necessários:</strong> ${request.materials || 'Não informados'}</p>
            <p><strong>Horário:</strong> Das ${request.startTime} às ${request.endTime}</p>
            <p><strong>Data da Solicitação:</strong> ${new Date(request.createdAt).toLocaleDateString('pt-BR')}</p>
          `
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar e-mail');
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }

  static async sendStatusUpdateEmail(request: WorkshopRequest) {
    try {
      // Buscar dados da escola
      const school = await SchoolService.getSchoolById(request.schoolId);
      if (!school) {
        throw new Error('Escola não encontrada');
      }

      // Buscar dados do representante
      const representative = await AuthService.getUserData(request.representativeId);
      if (!representative) {
        throw new Error('Representante não encontrado');
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'extensao.upt@iftm.edu.br',
          subject: `Atualização de Status - Solicitação de Oficina - ${request.schoolName}`,
          html: `
            <h2>Atualização de Status da Solicitação</h2>
            
            <h3>Dados da Escola</h3>
            <p><strong>Escola:</strong> ${request.schoolName}</p>
            <p><strong>Endereço:</strong> ${school.address}</p>
            <p><strong>Cidade/UF:</strong> ${school.city} - ${school.state}</p>
            <p><strong>Telefone:</strong> ${school.phone}</p>
            <p><strong>Email Institucional:</strong> ${school.email}</p>

            <h3>Dados do Representante</h3>
            <p><strong>Nome:</strong> ${representative.displayName}</p>
            <p><strong>Email:</strong> ${representative.email}</p>
            <p><strong>Telefone:</strong> ${representative.phone || 'Não informado'}</p>

            <h3>Status da Solicitação</h3>
            <p><strong>Status:</strong> ${request.status === 'approved' ? 'Aprovada' : 'Rejeitada'}</p>
            <p><strong>Data da Atualização:</strong> ${new Date(request.updatedAt).toLocaleDateString('pt-BR')}</p>
            <p><strong>Data da Solicitação Original:</strong> ${new Date(request.createdAt).toLocaleDateString('pt-BR')}</p>

            <h3>Detalhes da Oficina</h3>
            <p><strong>Tipo de Oficina:</strong> ${request.workshopType}</p>
            <p><strong>Horário:</strong> Das ${request.startTime} às ${request.endTime}</p>
            <p><strong>Quantidade de Horas:</strong> ${request.hours}</p>
            <p><strong>Quantidade de Alunos:</strong> ${request.students}</p>
          `
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar e-mail');
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }
} 