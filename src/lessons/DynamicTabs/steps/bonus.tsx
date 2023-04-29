import { Container } from '@components/Container'
import { tabsList } from '@lib/mock'
import { colorShades } from '@lib/theme'
import { useRef, useState } from 'react'
import { Text, useWindowDimensions, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { DynamicTabsFinal } from './final'

export default function DynamicTabsBonus() {
  const { width } = useWindowDimensions()
  const [selectedTabIndex, setSelectedTabIndex] = useState(2)
  const ref = useRef<FlatList>(null)
  return (
    <Container>
      <DynamicTabsFinal
        selectedTabIndex={selectedTabIndex}
        onChangeTab={(index) => {
          console.log('OnChangeTab Index: ', index)
          if (index !== selectedTabIndex) {
            ref.current?.scrollToIndex({
              index,
              animated: true,
            })
          }
        }}
      />
      <FlatList
        ref={ref}
        data={tabsList}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        initialScrollIndex={selectedTabIndex}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(ev) => {
          setSelectedTabIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / width),
          )
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, padding: 20 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colorShades.purple.base,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff' }}>{item}</Text>
              </View>
            </View>
          )
        }}
      />
    </Container>
  )
}
