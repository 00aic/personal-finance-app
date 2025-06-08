import { type Ref, onMounted, onUnmounted } from 'vue'

export function useClickOutside(
  elementRef: Ref<Element | null | undefined> | Readonly<Ref<Element | null | undefined>>,
  callback: () => void,
) {
  const handleClick = (event: Event) => {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClick)
  })

  return {
    handleClick,
  }
}
