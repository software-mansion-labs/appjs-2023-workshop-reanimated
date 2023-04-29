import { useRef, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { DynamicTabsFinal } from './steps/final'
import { Container } from '../../components/Container'
import { colorShades } from '../../lib/theme'

export default function DynamicTabsLesson() {
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
        data={[...Array(10).keys()]}
        keyExtractor={(item) => String(item)}
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
                }}
              />
            </View>
          )
        }}
      />
    </Container>
  )
}
