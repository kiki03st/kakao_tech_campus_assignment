// Date 객체를 'YYYY-MM-DD' 문자열로 변환 (todo의 date 필드 키로 사용)
export function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 주어진 날짜에서 days만큼 이동한 새 Date 객체 반환 (원본 불변)
export function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// 'YYYY-MM-DD' 문자열을 로컬 시간 기준 Date로 파싱 (타임존 이슈 방지를 위해 부분으로 생성)
export function parseDate(str) {
  const [year, month, day] = str.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// 주어진 날짜가 속한 주의 '월요일' Date 반환 (주간 뷰 시작일, 원본 불변)
export function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay() // 0=일 ~ 6=토
  const diff = day === 0 ? -6 : 1 - day // 월요일까지의 이동량
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}
