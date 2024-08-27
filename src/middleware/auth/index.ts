import { CryptoService } from '#common/helpers/crypto.service.js'
import { Context, Next } from 'hono'

type Role = 'member' | 'moderator' | 'admin'

const ROLE_PERMISSIONS: Record<Role, Set<string>> = {
  member: new Set(['GET']),
  moderator: new Set(['GET', 'POST', 'PUT', 'PATCH']),
  admin: new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
}

const RESTRICTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
const VALID_ROLES = new Set(['member', 'moderator', 'admin'])

const cryptoService = new CryptoService()

interface RouteConfig {
  path: string
  allowedEnvs: Set<string>
  skipAuth?: boolean
  message?: string
}

const ROUTE_CONFIG: RouteConfig[] = [
  {
    path: '/api/v1/register',
    allowedEnvs: new Set(['development', 'staging']),
    skipAuth: true,
    message: 'signup is not allowed in production'
  },
  { path: '/api/v1/authenticate', allowedEnvs: new Set(['development', 'staging', 'production']), skipAuth: true }
]

export async function authMiddleware(c: Context, next: Next) {
  const { method, path } = c.req
  const currentEnv = process.env.NODE_ENV || 'development'

  const routeConfig = ROUTE_CONFIG.find((route) => route.path === path)

  if (routeConfig) {
    if (!routeConfig.allowedEnvs.has(currentEnv)) {
      return c.json(
        {
          success: false,
          error: routeConfig.message
            ? routeConfig.message
            : `This route is not available in the ${currentEnv} environment.`
        },
        403
      )
    }
    if (routeConfig.skipAuth) {
      return next()
    }
  }

  if (!RESTRICTED_METHODS.has(method)) return next()

  const authorization = c.req.header('Authorization')

  if (!authorization) {
    return c.json({ success: false, error: 'No authorization header | unauthorized request' }, 401)
  }
  const token = authorization.split(' ')[1]

  if (!authorization.startsWith('Bearer')) {
    return c.json({ success: false, error: 'Invalid authorization header format. Format is "Bearer <token>".' }, 401)
  }

  try {
    const userPayload = cryptoService.verifyAccessToken(token)
    if (!VALID_ROLES.has(userPayload.role) || !ROLE_PERMISSIONS[userPayload.role as Role].has(method)) {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    c.set('user', userPayload)
    await next()
  } catch (error) {
    console.error(error)
    return c.json({ success: false, error: 'Invalid token' }, 401)
  }
}
