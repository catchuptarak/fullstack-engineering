import { Module } from '@nestjs/common';
import { MenuService } from './menus.service';
import { MenuController } from './menus.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  imports: [PrismaModule],
})
export class MenusModule {}
