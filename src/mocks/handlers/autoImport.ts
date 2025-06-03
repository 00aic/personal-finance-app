// mocks/auto-import.ts
import type { RequestHandler } from 'msw'
import globalRequestInterceptor from '../interceptors/mockCheck'

export async function autoImportHandlers(): Promise<RequestHandler[]> {
  const modules = import.meta.glob('../handlers/modules/*.ts') as Record<
    string,
    () => Promise<{ default: RequestHandler | RequestHandler[] }>
  >

  const handlers: RequestHandler[] = [globalRequestInterceptor]

  for (const path in modules) {
    const module = await modules[path]()
    const moduleHandlers = Array.isArray(module.default) ? module.default : [module.default]
    handlers.push(...moduleHandlers)
  }

  return handlers
}
