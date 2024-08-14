function stringToColor(string: string): string {
  let hash = 0
  let i: number

  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
    hash = string?.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value?.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

interface StringAvatarProps {
  sx: {
    bgcolor: string
  }
  children: string
}

export function stringAvatar(name: string): StringAvatarProps {
  const initials = name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()

  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: initials
  }
}
