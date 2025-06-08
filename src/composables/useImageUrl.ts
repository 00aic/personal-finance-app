import { ref, watchEffect, type Ref } from 'vue'

const imageModules = import.meta.glob('@/assets/images/**/*.{svg,png,jpg,jpeg,gif,webp}', {
  eager: true,
  import: 'default',
})

const imageMap: Record<string, string> = Object.entries(imageModules).reduce(
  (map: Record<string, string>, [path, src]) => {
    const filename = path.split('/').pop()!
    map[filename] = src as string
    return map
  },
  {},
)

/**
 * 获取图片路径（带响应式能力）
 * @param name 图片名，可为：
 *   - 本地图片（如：'icon-example' 或 'icon-example.svg'）
 *   - 网络图片（如：http/https 开头）
 * @returns ref<string> 可绑定到 img 的 src
 */
export function useImageUrl(name: string | Ref<string | undefined>) {
  const imageSrc = ref('')

  watchEffect(() => {
    const raw = typeof name === 'string' ? name : name.value

    if (!raw) {
      imageSrc.value = ''
      return
    }

    if (raw.startsWith('http') || raw.startsWith('//')) {
      // 远程图片
      imageSrc.value = raw
    } else {
      // 本地图片：尝试带后缀、自动匹配
      const exactMatch = imageMap[raw]
      if (exactMatch) {
        imageSrc.value = exactMatch
        return
      }

      const guess = Object.entries(imageMap).find(([key]) => key.startsWith(raw + '.'))
      imageSrc.value = guess?.[1] || ''
    }
  })

  return imageSrc
}
