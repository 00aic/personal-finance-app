type NumberFormatStyle = 'decimal' | 'currency' | 'percent'
type NumberFormatOptions = {
  locale?: string
  style?: NumberFormatStyle
  currency?: string
}

export const formatNumber = (number: number, options: NumberFormatOptions = {}) => {
  const { locale = 'en-US', style = 'currency', currency = 'GBP' } = options
  const formatter = new Intl.NumberFormat(locale, {
    style,
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  let formatted = formatter.format(number)

  // 处理符号在左侧的情况（如 £、$）
  formatted = formatted.replace(/(\p{Sc})(\d)/u, '$1 $2')
  // 处理符号在右侧的情况（如 € 在某些语言中）
  formatted = formatted.replace(/(\d)(\p{Sc})/u, '$1 $2')

  return formatted
}
