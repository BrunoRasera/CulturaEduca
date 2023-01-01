import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';

import configuration from './config/configuration';
import { AgentesModule } from './agentes/agentes.module';
import { AreasAtuacaoModule } from './areas-atuacao/areas-atuacao.module';
import { AreasEstudoModule } from './areas-estudo/areas-estudo.module';
import { EnderecosModule } from './enderecos/enderecos.module';
import { PublicosFocaisModule } from './publicos-focais/publicos-focais.module';
import { TiposEspacosModule } from './tipos-espacos/tipos-espacos.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<SequelizeModuleOptions>('database'),
      inject: [ConfigService],
    }),
    AgentesModule,
    AreasAtuacaoModule,
    AreasEstudoModule,
    EnderecosModule,
    PublicosFocaisModule,
    TiposEspacosModule,
    UsuariosModule,
  ],
})
export class AppModule {}
