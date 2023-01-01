import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { difference, uniq } from 'lodash';

import {
  Agente,
  AgenteRedeSocial,
  AreaAtuacao,
  AreaEstudo,
  Escolaridade,
  Etnia,
  Ocupacao,
  PublicoFocal,
  TipoEspaco,
  Usuario,
} from '@/models';
import { CriaPessoaFisicaDto } from './dto';

@Injectable()
export class AgentesService {
  constructor(
    @InjectModel(Agente) public agenteModel: typeof Agente,
    @InjectModel(AgenteRedeSocial)
    public agenteRedeSocialModel: typeof AgenteRedeSocial,
    @InjectModel(AreaAtuacao) public areaAtuacaoModel: typeof AreaAtuacao,
    @InjectModel(AreaEstudo) public areaEstudoModel: typeof AreaEstudo,
    @InjectModel(Escolaridade) public escolaridadeModel: typeof Escolaridade,
    @InjectModel(Etnia) public etniaModel: typeof Etnia,
    @InjectModel(Ocupacao) public ocupacaoModel: typeof Ocupacao,
    @InjectModel(PublicoFocal) public publicoFocalModel: typeof PublicoFocal,
    @InjectModel(TipoEspaco) public tipoEspacoModel: typeof TipoEspaco,
    @InjectModel(Usuario) public usuarioModel: typeof Usuario,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Cria agente pessoa física (associado a usuário)
   * @param {CriaPessoaFisicaDto} dto Dto contendo dados para criar o agente
   * @param {number} usuarioId Id do usuário logado
   * @returns {Agente} Agente criado
   */
  async criaPessoaFisica(dto: CriaPessoaFisicaDto, usuarioId: number) {
    // verifica se usuário já tem agente cadastrado
    const usuario = await this.usuarioModel.findByPk(usuarioId);
    if (usuario.agenteId) {
      throw new UnprocessableEntityException(
        'Usuário já tem agente cadastrado',
      );
    }

    // verificação etnia
    const etniaId = dto?.usuario?.etniaId || null;
    if (etniaId) {
      const etnia = await this.etniaModel.findByPk(etniaId);
      if (!etnia) {
        throw new NotFoundException('Etnia não encontrada');
      }
      if (etnia.outros) {
        const etniaOutros = dto?.usuario?.etniaOutros?.trim() || null;
        if (!etniaOutros) {
          throw new UnprocessableEntityException(
            'Campo "etnia outros" é obrigatório',
          );
        }
      }
    }

    // verificação ocupação
    const ocupacaoId = dto?.usuario?.ocupacaoId || null;
    if (ocupacaoId) {
      const ocupacao = await this.ocupacaoModel.findByPk(ocupacaoId);
      if (!ocupacao) {
        throw new NotFoundException('Ocupação não encontrada');
      }
      if (ocupacao.outros) {
        const ocupacaoOutros = dto?.usuario?.ocupacaoOutros?.trim() || null;
        if (!ocupacaoOutros) {
          throw new UnprocessableEntityException(
            'Campo "ocupação outros" é obrigatório',
          );
        }
      }
    }

    // verificação escolaridade
    const escolaridadeId = dto?.usuario?.escolaridadeId || null;
    if (escolaridadeId) {
      const escolaridade = await this.escolaridadeModel.findByPk(
        escolaridadeId,
      );
      if (!escolaridade) {
        throw new NotFoundException('Escolaridade não encontrada');
      }
    }

    let agente: Agente;
    let transaction: Transaction;
    try {
      // inicia transaction
      transaction = await this.sequelize.transaction();

      // criacao agente
      const dataAgente = {
        email: dto?.agente?.email?.trim() || null,
        telefone1: dto?.agente?.telefone1?.trim() || null,
        telefone2: dto?.agente?.telefone2?.trim() || null,
        site: dto?.agente?.site?.trim() || null,
        atuaDesdeAno: dto?.agente?.atuaDesdeAno || null,
        areaAtuacaoOutros: dto?.agente?.areaAtuacaoOutros?.trim() || null,
        abrangenciaGeografica: dto?.agente?.abrangenciaGeografica || null,
        historico: dto?.agente?.historico?.trim() || null,
        objetivo: dto?.agente?.objetivo?.trim() || null,
        createdBy: usuarioId,
        updatedBy: usuarioId,
      } as Agente;
      agente = await this.agenteModel.create(dataAgente, {
        transaction,
      });

      // redes sociais
      const dataRedesSociais = (dto?.agente?.redesSociais || []).map(
        (el) =>
          ({
            agenteId: agente.id,
            plataforma: el.plataforma,
            url: el.url?.trim() || null,
          } as AgenteRedeSocial),
      );
      if (dataRedesSociais.length > 0) {
        await this.agenteRedeSocialModel.bulkCreate(dataRedesSociais, {
          transaction,
        });
      }

      // areas de atuacao
      const areasAtuacaoIds = uniq(dto?.agente?.areasAtuacaoIds || []);
      const areaAtuacaoOutros = dto?.agente?.areaAtuacaoOutros?.trim() || null;
      const areasAtuacao = await this.buscaEVerificaAreasAtuacao(
        areasAtuacaoIds,
        areaAtuacaoOutros,
      );
      if (areasAtuacao.length > 0) {
        await agente.$add('areasAtuacao', areasAtuacao, { transaction });
      }

      // areas de estudo
      const areasEstudoIds = uniq(dto?.agente?.areasEstudoIds || []);
      const areasEstudo = await this.buscaEVerificaAreasEstudo(areasEstudoIds);
      if (areasEstudo.length > 0) {
        await agente.$add('areasEstudo', areasEstudo, { transaction });
      }

      // publicos focais
      const publicosFocaisIds = uniq(dto?.agente?.publicosFocaisIds || []);
      const publicosFocais = await this.buscaEVerificaPublicosFocais(
        publicosFocaisIds,
      );
      if (publicosFocais.length > 0) {
        await agente.$add('publicosFocais', publicosFocais, { transaction });
      }

      // tipos de espacos
      const tiposEspacosIds = uniq(dto?.agente?.tiposEspacosIds || []);
      const tiposEspacos = await this.buscaEVerificaTiposEspacos(
        tiposEspacosIds,
      );
      if (tiposEspacos.length > 0) {
        await agente.$add('tiposEspacos', tiposEspacos, { transaction });
      }

      // atualizacao usuario
      const dataUsuario = {
        agenteId: agente.id,
        etniaId: dto?.usuario?.etniaId || null,
        etniaOutros: dto?.usuario?.etniaOutros?.trim() || null,
        ocupacaoId: dto?.usuario?.ocupacaoId || null,
        ocupacaoOutros: dto?.usuario?.ocupacaoOutros?.trim() || null,
        escolaridadeId: dto?.usuario?.escolaridadeId || null,
        identidadeGenero: dto?.usuario?.identidadeGenero || null,
        racaCorIbge: dto?.usuario?.racaCorIbge || null,
      };
      await usuario.update(dataUsuario, { transaction });

      // commit transaction
      await transaction.commit();
    } catch (err) {
      await transaction?.rollback();
      throw err;
    }

    return this.agenteModel.findByPk(agente.id);
  }

  /**
   * Busca e verifica áreas de atuação
   * @param {number[]} areasAtuacaoIds Ids das áreas de atuação
   * @param {string | null} areaAtuacaoOutros Campo do dto contendo outros caso necessário
   * @returns {AreaAtuacao[]} Array de áreas de atuação
   */
  async buscaEVerificaAreasAtuacao(
    areasAtuacaoIds: number[],
    areaAtuacaoOutros: string | null,
  ) {
    const areasAtuacao = await this.areaAtuacaoModel.findAll({
      where: { id: { [Op.in]: areasAtuacaoIds } },
    });
    // se algum id enviado não existir no banco
    const notFoundIds = difference(
      areasAtuacaoIds,
      areasAtuacao.map((el) => el.id),
    );
    if (notFoundIds.length > 0) {
      throw new NotFoundException('Área de atuação não encontrada');
    }
    // se alguma area de atuação requer o campo outros e não veio preenchido
    if (areasAtuacao.find((el) => el.outros) && !areaAtuacaoOutros) {
      throw new UnprocessableEntityException(
        'Campo "área de atuação outros" é obrigatório',
      );
    }
    return areasAtuacao;
  }

  /**
   * Busca e verifica áreas de estudo
   * @param {number[]} areasEstudoIds Ids das áreas de estudo
   * @returns {AreaEstudo[]} Array de áreas de estudo
   */
  async buscaEVerificaAreasEstudo(areasEstudoIds: number[]) {
    const areasEstudo = await this.areaEstudoModel.findAll({
      where: { id: { [Op.in]: areasEstudoIds } },
    });
    // se algum id enviado não existir no banco
    const notFoundIds = difference(
      areasEstudoIds,
      areasEstudo.map((el) => el.id),
    );
    if (notFoundIds.length > 0) {
      throw new NotFoundException('Área de estudo não encontrada');
    }
    return areasEstudo;
  }

  /**
   * Busca e verifica públicos focais
   * @param {number[]} areasEstudoIds Ids das públicos focais
   * @returns {PublicoFocal[]} Array de públicos focais
   */
  async buscaEVerificaPublicosFocais(publicosFocaisIds: number[]) {
    const publicosFocais = await this.publicoFocalModel.findAll({
      where: { id: { [Op.in]: publicosFocaisIds } },
    });
    // se algum id enviado não existir no banco
    const notFoundIds = difference(
      publicosFocaisIds,
      publicosFocais.map((el) => el.id),
    );
    if (notFoundIds.length > 0) {
      throw new NotFoundException('Público focal não encontrado');
    }
    return publicosFocais;
  }

  /**
   * Busca e verifica tipos de espaços
   * @param {number[]} areasEstudoIds Ids das tipos de espaços
   * @returns {TipoEspaco[]} Array de tipos de espaços
   */
  async buscaEVerificaTiposEspacos(tiposEspacosIds: number[]) {
    const tiposEspacos = await this.tipoEspacoModel.findAll({
      where: { id: { [Op.in]: tiposEspacosIds } },
    });
    // se algum id enviado não existir no banco
    const notFoundIds = difference(
      tiposEspacosIds,
      tiposEspacos.map((el) => el.id),
    );
    if (notFoundIds.length > 0) {
      throw new NotFoundException('Tipo de espaço não encontrado');
    }
    return tiposEspacos;
  }
}
