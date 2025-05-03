import { getServerSession } from 'next-auth/next'
import { getManager, entities } from '@auth/typeorm-adapter'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export async function getSession() {
  return await getServerSession(authOptions)
}

let managerPromise: Promise<any> | null = null;

async function getConnectionManager() {
  if (!managerPromise) {
    managerPromise = getManager({
      dataSource: {
        type: "postgres",
        url: process.env.AUTH_TYPEORM_CONNECTION,
        entities: entities,
        synchronize: false,
        schema: "users",
        useUTC: true,
        extra: {
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        }
      },
      entities
    });
  }
  return managerPromise;
}

export async function getCurrentUser() {
  try {
    // Obter a sessão usando os authOptions definidos
    const session = await getSession()
    if (!session?.user?.email) {
      return null
    }
    
    const manager = await getConnectionManager();
    const userRepository = manager.getRepository('UserEntity')
    
    // Se temos um ID na sessão, usamos ele para buscar o usuário
    if (session.user.id) {
      const user = await userRepository.findOne({
        where: { id: session.user.id }
      })
      
      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    }
    
    // Fallback para busca por email caso o ID não esteja disponível
    const user = await userRepository.findOne({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image
    }
    
  } catch (error: unknown) {
    console.error('Error getting current user:', error)
    return null
  }
}