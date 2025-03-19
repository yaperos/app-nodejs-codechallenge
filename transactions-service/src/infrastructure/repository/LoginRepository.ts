import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LoginRepository {
    /**
     * Busca un usuario por su username
     * @param username - Nombre del usuario
     * @returns Datos del usuario
     */
    async findOnlyByUsername(username: string) {
        return prisma.user.findUnique({ where: { username } });
    }
}
