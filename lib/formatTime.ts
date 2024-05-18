function formatLastMessageTime(lastMessageAt: Date | null): string {
    if (!lastMessageAt) {
      return new Date().toLocaleDateString()
    }
    const now = new Date()
    const diffInDays = Math.floor(
      (now.getTime() - new Date(lastMessageAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diffInDays === 0) {
      return new Date(lastMessageAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else {
      return new Date(lastMessageAt).toLocaleDateString()
    }
}

export default formatLastMessageTime