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
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'medium':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200'
  }
}

export function getLevelColor(level) {
  switch (level?.toLowerCase()) {
    case 'junior':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'mid':
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'senior':
    case 'expert':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'in_progress':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function getScoreColor(score) {
  if (score >= 90) return 'text-emerald-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-amber-600'
  return 'text-red-600'
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getTopicIcon(topic) {
  const topicMap = {
    'sql': '🗃️',
    'python': '🐍',
    'spark': '⚡',
    'kafka': '📊',
    'pipeline': '🔄',
    'cloud': '☁️',
    'docker': '🐳',
    'system': '🏗️',
    'etl': '🔄',
    'data': '📈'
  }
  
  const key = topic.toLowerCase()
  for (const [word, icon] of Object.entries(topicMap)) {
    if (key.includes(word)) return icon
  }
  return '💾'
}