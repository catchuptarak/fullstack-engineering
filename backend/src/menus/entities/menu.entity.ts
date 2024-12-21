import { Menu } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MenuEntity implements Menu {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: true, nullable: false })
  depth: number;

  @ApiProperty({ required: true, nullable: false })
  parentId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}