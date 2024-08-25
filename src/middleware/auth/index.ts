import { CryptoService } from '#common/helpers/crypto.service.js'
import { Context, Next } from 'hono'
import { verify } from 'jsonwebtoken'

type Role = 'member' | 'moderator' | 'admin'

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  member: ['GET'],
  moderator: ['GET', 'POST', 'PUT', 'PATCH'],
  admin: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}

const restrictedMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

function isValidRole(role: string): role is Role {
  return ['member', 'moderator', 'admin'].includes(role)
}
const cryptoService = new CryptoService()
const authenticationRoutes = ['/api/v1/register', '/api/v1/authenticate']

/**
 *   NOTE: REGISTRATION OF NEW USER ONLY ALLOWED IN STAGING EVIROMENT
 */
export async function authMiddleware(c: Context, next: Next) {
  const method = c.req.method
  const path = c.req.path
  // Skip middleware for /register and /authenticate routes

  if (authenticationRoutes.includes(path) && process.env.NODE_ENV !== 'production') {
    return next()
  }

  // Allow OPTIONS, HEAD, and other non-restricted methods for all
  if (!restrictedMethods.includes(method)) {
    return next()
  }
  const authorization = c.req.header('Authorization')

  if (!authorization) {
    return c.json({ success: false, error: 'No authorization header | unauthorized request' }, 401)
  }
  const token = authorization.split(' ')[1]

  if (!authorization.startsWith('Bearer')) {
    return c.json({ success: false, error: 'Invalid authorization header format. Format is "Bearer <token>".' }, 401)
  }

  try {
    const userPayload = await cryptoService.verifyAccessToken(token)

    if (!isValidRole(userPayload.role)) {
      return c.json({ success: false, error: 'Forbidden Request' }, 403)
    }
    const allowedMethods = ROLE_PERMISSIONS[userPayload.role]

    if (!allowedMethods.includes(method)) {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    c.set('user', userPayload)

    await next()
  } catch (error) {
    return c.json({ success: false, error: 'Invalid token' }, 401)
  }
}
