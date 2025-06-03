import { setupWorker, type SetupWorker } from 'msw/browser'

// 该方式生产环境下有问题
// import { autoImportHandlers } from './handlers/autoImport'
// const handlers = await autoImportHandlers()
// export const worker = setupWorker(...handlers)

// 没有后台，因此生产环境下启用mock数据
let worker: SetupWorker
// 暴露开发工具方法
export const initMock = async () => {
  const { autoImportHandlers } = await import('./handlers/autoImport')
  const handlers = await autoImportHandlers()
  worker = setupWorker(...handlers)
  return {
    start: () =>
      worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: `${import.meta.env.BASE_URL}mockServiceWorker.js`, // 注意 BASE_URL 是以 /invoice-app/ 开头的
        },
      }),
    stop: () => worker.stop(),
    reset: () => {
      // 可以在这里重置模拟数据
    },
    // docs: () => {
    //   // 自动生成 Mock API 文档
    //   handlers.forEach((handler) => {
    //     console.log(`${handler.info.method} ${handler.info.path}`)
    //   })
    // },
  }
}
