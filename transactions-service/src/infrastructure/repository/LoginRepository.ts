import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LoginRepository {

   /**
   * Obtener usuario por ID
   * @param id Id del usuario
   * @returns Lista de usuarios
   */
    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }

    /**
     * Busca un usuario por su username
     * @param username - Nombre del usuario
     * @returns Datos del usuario
     */
    async findOnlyByUsername(username: string) {
        return prisma.user.findUnique({ where: { username } });
    }
}
