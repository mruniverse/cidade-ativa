export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('pt-BR');
}

export function formatViewCommentsText(
  isLoading: boolean,
  showComments: boolean,
  count: number
): string {
  if (isLoading) return 'Carregando...';
  if (showComments) return 'Ocultar comentários';
  if (count === 1) return 'Ver 1 comentário';
  return `Ver ${count} comentários`;
}
