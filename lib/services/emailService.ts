"use client"

import { WorkshopRequest } from './workshopRequestService';

export class EmailService {
  static async sendWorkshopRequestEmail(request: WorkshopRequest) {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'tiagospagiari@gmail.com',
        subject: `Nova Solicitação de Oficina - ${request.schoolName}`,
        html: `
          <h2>Nova Solicitação de Oficina</h2>
          <p><strong>Escola:</strong> ${request.schoolName}</p>
          <p><strong>Coordenador:</strong> ${request.coordinator}</p>
          <p><strong>Horas:</strong> ${request.hours}</p>
          <p><strong>Número de Alunos:</strong> ${request.students}</p>
          <p><strong>Tipo de Oficina:</strong> ${request.workshopType}</p>
          <p><strong>Descrição Adicional:</strong> ${request.otherDescription}</p>
          <p><strong>Materiais Necessários:</strong> ${request.materials}</p>
          <p><strong>Horário:</strong> Das ${request.startTime} às ${request.endTime}</p>
        `
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar e-mail');
    }

    return true;
  }

  static async sendStatusUpdateEmail(request: WorkshopRequest) {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'tiagospagiari@gmail.com',
        subject: `Atualização de Status - Solicitação de Oficina - ${request.schoolName}`,
        html: `
          <h2>Atualização de Status da Solicitação</h2>
          <p><strong>Escola:</strong> ${request.schoolName}</p>
          <p><strong>Status:</strong> ${request.status === 'approved' ? 'Aprovada' : 'Rejeitada'}</p>
          <p><strong>Data da Atualização:</strong> ${new Date().toLocaleDateString()}</p>
        `
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar e-mail');
    }

    return true;
  }
} 