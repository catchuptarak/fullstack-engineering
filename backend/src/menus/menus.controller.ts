import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MenuService } from './menus.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('add')
  async addNode(@Body() body: { name: string; parentId?: number }) {
    return this.menuService.addNode(body.name, body.parentId);
  }

  @Get()
  async getTree() {
    return this.menuService.getTree();
  }

  @Put(':id')
  async updateNode(@Param('id') id: string, @Body() body: { name: string }) {
    return this.menuService.updateNode(+id, body.name);
  }

  @Delete(':id')
  async deleteNode(@Param('id') id: string) {
    return this.menuService.deleteNode(+id);
  }

  @Get('all')
  async getMenuHierarchy() {
    return this.menuService.getMenuHierarchy();
  }
}
