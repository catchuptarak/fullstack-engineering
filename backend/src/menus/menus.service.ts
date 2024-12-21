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

  async getMenuHierarchy(depth: number = 20) {
    // Validate depth parameter to ensure it's a non-negative integer
    if (depth < 0 || !Number.isInteger(depth)) {
      throw new Error("Invalid depth value. Depth must be a non-negative integer.");
    }
  
    // Recursive function to include children based on depth
    const includeChildren = (currentDepth: number) => {
      if (currentDepth > depth) {
        return {}; // Stop recursion if we've reached the specified depth
      }
  
      return {
        children: {
          include: includeChildren(currentDepth + 1), // Recurse for next level
        },
      };
    };
  
    try {
      // Fetch root nodes and recursively include children based on the depth
      return this.prisma.menu.findMany({
        where: { parentId: null }, // Root nodes where parentId is null
        include: includeChildren(1), // Start recursion from depth 1
      });
    } catch (error) {
      console.error("Error fetching menu hierarchy:", error);
      throw new Error("Failed to fetch menu hierarchy");
    }
  }
}

