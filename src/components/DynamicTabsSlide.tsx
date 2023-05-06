import type { tabsList } from '@lib/mock'
import { colorShades, layout } from '@lib/theme'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
export function DynamicTabsSlide({ item }: { item: (typeof tabsList)[0] }) {
  const { width } = useWindowDimensions()
  return (
    <View style={{ width, padding: layout.spacing * 2 }}>
      <View style={styles.item}>
        <Text style={styles.text}>{item}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    backgroundColor: colorShades.purple.base,
    borderRadius: layout.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { color: '#fff' },
})
