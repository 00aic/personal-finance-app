type DateFormatOptions = {
  locale?: string
  prefix?: string
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'
  weekday?: 'long' | 'short' | 'narrow'
}

/**
 *
 * @param dateParam 2021-08-21
 * @param options
 * @returns
 */
export const formatIntlDate = (dateParam: string | Date, options: DateFormatOptions = {}) => {
  const { locale = 'en-GB', prefix = '', year, month, day, weekday } = options
  const date = typeof dateParam === 'string' ? new Date(dateParam) : dateParam

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const hasDateParts = year || month || day

  const formatOptions: Intl.DateTimeFormatOptions = {
    ...(hasDateParts
      ? {}
      : {
          // weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    ...(year ? { year } : {}),
    ...(month ? { month } : {}),
    ...(day ? { day } : {}),
    ...(weekday ? { weekday } : {}),
  }

  const formatter = new Intl.DateTimeFormat(locale, formatOptions)
  return `${prefix} ${formatter.format(date)}`
}

export const formatDate = (dateParam: string | Date, format: string): string => {
  const date = typeof dateParam === 'string' ? new Date(dateParam) : dateParam
  const map: Record<string, string | number> = {
    yyyy: date.getFullYear(),
    yy: String(date.getFullYear()).slice(-2),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    M: date.getMonth() + 1,
    dd: String(date.getDate()).padStart(2, '0'),
    d: date.getDate(),
    HH: String(date.getHours()).padStart(2, '0'),
    H: date.getHours(),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  }
  return format.replace(/yyyy|yy|MM|M|dd|d|HH|H|mm|ss/g, (match) => String(map[match]))
}
