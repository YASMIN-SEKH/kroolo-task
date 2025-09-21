type TimeDisplayProps = {
  minutes: number
}

export default function TimeDisplay({ minutes }: TimeDisplayProps) {
  if (minutes < 60) {
    return <span>{minutes}m</span>
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours < 24) {
    return (
      <span>
        {hours}h {remainingMinutes > 0 && `${remainingMinutes}m`}
      </span>
    )
  }

  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24

  return (
    <span>
      {days}d {remainingHours > 0 && `${remainingHours}h`}
    </span>
  )
}