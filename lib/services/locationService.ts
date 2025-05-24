export interface City {
  id: number;
  nome: string;
}

export class LocationService {
  static async getCitiesByState(uf: string): Promise<City[]> {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar cidades');
      }

      const cities: City[] = await response.json();
      return cities.sort((a, b) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      throw new Error('Não foi possível buscar as cidades');
    }
  }

  static validateCEP(cep: string): boolean {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    // Verifica se tem 8 dígitos
    return cleanCEP.length === 8;
  }

  static formatCEP(cep: string): string {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    
    // Se não tiver dígitos, retorna vazio
    if (!cleanCEP) return '';
    
    // Se tiver até 5 dígitos, retorna como está
    if (cleanCEP.length <= 5) {
      return cleanCEP;
    }
    
    // Se tiver mais de 5 dígitos, adiciona o hífen
    return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5, 8)}`;
  }

  static validatePhone(phone: string): boolean {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Verifica se tem 10 ou 11 dígitos (com ou sem DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  static formatPhone(phone: string): string {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Se tiver 11 dígitos (com 9 na frente)
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    }
    // Se tiver 10 dígitos (sem 9 na frente)
    else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
    }
    
    return phone;
  }
} 