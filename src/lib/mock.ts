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
      data: [...Array(Math.floor(Math.random() * 40) + 5).keys()].map((i) => ({
        name: `${letter}-Contact ${i + 1}`,
        avatar: randomAvatar(),
      })),
    }
  },
)
