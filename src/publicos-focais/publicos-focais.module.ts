import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PublicoFocal } from '@/models';
import { PublicosFocaisService } from './publicos-focais.service';
import { PublicosFocaisController } from './publicos-focais.controller';

@Module({
  imports: [SequelizeModule.forFeature([PublicoFocal])],
  providers: [PublicosFocaisService],
  controllers: [PublicosFocaisController],
})
export class PublicosFocaisModule {}
