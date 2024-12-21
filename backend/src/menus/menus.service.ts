import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // Add a new node
  async addNode(name: string, parentId?: number) {
    let depth = 0;
  
    // Check if parentId exists, if provided
    if (parentId) {
      const parent = await this.prisma.menu.findUnique({ where: { id: parentId } });
      if (!parent) {
        throw new Error('Parent node does not exist');
      }
      depth = parent.depth + 1;
    }
  
    // Create the node
    return this.prisma.menu.create({
      data: {
        name,
        depth,
        parentId: parentId || null, // Set to null if no parentId is provided
      },
    });
  }

  // Get all nodes
  async getTree() {
    return this.prisma.menu.findMany({
      include: {
        children: true, // Fetch child nodes
      },
    });
  }

  // Update a node
  async updateNode(id: number, name: string) {
    return this.prisma.menu.update({
      where: { id },
      data: { name },
    });
  }

  // Delete a node
  async deleteNode(id: number) {
    return this.prisma.menu.delete({
      where: { id },
    });
  }

  async getMenuHierarchy() {
    return this.prisma.menu.findMany({
      where: { parentId: null }, // Start with root nodes
      include: {
        children: {
          include: {
            children: true, // You can nest this as needed for deeper hierarchies
          },
        },
      },
    });
  }
}

