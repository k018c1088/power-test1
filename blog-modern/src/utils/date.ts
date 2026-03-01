export function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function getReadingTime(content: string): string {
  const wordsPerMinute = 500; // Japanese characters per minute
  const charCount = content.replace(/\s+/g, '').length;
  const minutes = Math.max(1, Math.ceil(charCount / wordsPerMinute));
  return `${minutes}min`;
}
