import { makeMutable } from 'react-native-reanimated'

import { layout } from './theme'

export const tabsList = [
  'Animation',
  'Branding',
  'Illustration',
  'Calligraphy',
  'Doodling',
  'Game development',
  'Drawing',
  'Development',
]

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'

const randomAvatar = () => {
  const num = Math.floor(Math.random() * 70)
  return `https://i.pravatar.cc/${layout.avatarSize}?img=${num}`
}
export const contacts = [...Array(alphabet.length).keys()].map(
  (sectionIndex) => {
    const letter = alphabet.charAt(sectionIndex).toUpperCase()
    return {
      title: letter,
      index: sectionIndex,
      key: `list-${letter}`,
      y: makeMutable(0),
      data: [...Array(Math.floor(Math.random() * 5) + 5).keys()].map((i) => ({
        name: `${letter}-Contact ${i + 1}`,
        avatar: randomAvatar(),
      })),
    }
  },
)

export const friends = [
  'https://pbs.twimg.com/profile_images/1276570366555684865/7J55FrYi_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1064786289311010816/zD2FlyxR_400x400.jpg',
]
