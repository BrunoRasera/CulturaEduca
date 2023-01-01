import { faker } from '@faker-js/faker/locale/pt_BR';
import { CriaPessoaFisicaDto } from '@/agentes/dto/cria-pessoa-fisica.dto';

export function geraCriaPessoaFisicaDto(data?: any): CriaPessoaFisicaDto {
  return {
    agente: {
      abrangenciaGeografica: data?.agente?.abrangenciaGeografica
        ? data.agente.abrangenciaGeografica
        : null,
      areaAtuacaoOutros: data?.agente?.areaAtuacaoOutros
        ? data.agente.areaAtuacaoOutros
        : null,
      atuaDesdeAno: data?.agente?.atuaDesdeAno
        ? data.agente.atuaDesdeAno
        : null,
      email:
        data?.agente?.email !== undefined
          ? data.agente.email
          : faker.internet.email(),
      historico: data?.agente?.historico ? data.agente.historico : null,
      objetivo: data?.agente?.objetivo ? data.agente.objetivo : null,
      site: data?.agente?.site ? data.agente.site : null,
      telefone1: data?.agente?.telefone1 ? data.agente.telefone1 : null,
      telefone2: data?.agente?.telefone2 ? data.agente.telefone2 : null,
      redesSociais: data?.agente?.redesSociais ? data.agente.redesSociais : [],
      areasAtuacaoIds: data?.agente?.areasAtuacaoIds
        ? data.agente.areasAtuacaoIds
        : [],
      areasEstudoIds: data?.agente?.areasEstudoIds
        ? data.agente.areasEstudoIds
        : [],
      publicosFocaisIds: data?.agente?.publicosFocaisIds
        ? data.agente.publicosFocaisIds
        : [],
      tiposEspacosIds: data?.agente?.tiposEspacosIds
        ? data.agente.tiposEspacosIds
        : [],
    },
    usuario: {
      escolaridadeId: data?.usuario?.escolaridadeId
        ? data.usuario.escolaridadeId
        : null,
      etniaId: data?.usuario?.etniaId ? data.usuario.etniaId : null,
      etniaOutros: data?.usuario?.etniaOutros ? data.usuario.etniaOutros : null,
      identidadeGenero: data?.usuario?.identidadeGenero
        ? data.usuario.identidadeGenero
        : null,
      ocupacaoId: data?.usuario?.ocupacaoId ? data.usuario.ocupacaoId : null,
      ocupacaoOutros: data?.usuario?.ocupacaoOutros
        ? data.usuario.ocupacaoOutros
        : null,
      racaCorIbge: data?.usuario?.racaCorIbge ? data.usuario.racaCorIbge : null,
    },
  };
}
