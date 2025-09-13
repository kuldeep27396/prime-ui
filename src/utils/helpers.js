export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function getDifficultyColor(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'badge-green'
    case 'medium':
      return 'badge-yellow'
    case 'hard':
      return 'badge-red'
    default:
      return 'badge-blue'
  }
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return 'badge-blue'
    case 'in_progress':
      return 'badge-yellow'
    case 'completed':
      return 'badge-green'
    default:
      return 'badge-blue'
  }
}