/* global _WORKLET */
import { Container } from '@components/Container'
import { tabsList } from '@lib/mock'
import { hitSlop } from '@lib/reanimated'
import { colorShades } from '@lib/theme'
import { memo, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler'
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  scrollTo,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import type { MeasuredDimensions } from 'react-native-reanimated/src/reanimated2/commonTypes'

type TabsProps = {
  name: string
  onPress: (measurements: MeasuredDimensions) => void
  isActiveTabIndex: boolean
}

type TabWithMeasurements = {
  index: number
  measuremenets: MeasuredDimensions
}

const Tab = memo(({ onPress, name, isActiveTabIndex }: TabsProps) => {
  const tabRef = useAnimatedRef<View>()
  const sendMeasurements = () => {
    runOnUI(() => {
      'worklet'
      const measurements = measure(tabRef)
      runOnJS(onPress)(measurements)
    })()
  }

  useEffect(() => {
    // Send measurements when the active tab changes. This callback is necessary
    // because we need the tab measurements in order to animate the indicator
    // and the position of the scroll
    if (isActiveTabIndex) {
      sendMeasurements()
    }
  }, [isActiveTabIndex])

  return (
    <View
      style={{ marginHorizontal: 4, paddingVertical: 10 }}
      ref={tabRef}
      onLayout={() => {
        // This is needed because we can't send the initial render measurements
        // without hooking into `onLayout`.
        if (isActiveTabIndex) {
          sendMeasurements()
        }
      }}
    >
      <TouchableOpacity
        onPress={sendMeasurements}
        hitSlop={hitSlop}
        style={{ marginHorizontal: 8 }}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    </View>
  )
})

function Indicator({
  selectedTab,
}: {
  selectedTab: SharedValue<TabWithMeasurements | null>
}) {
  const stylez = useAnimatedStyle(() => {
    if (!selectedTab?.value) {
      return {}
    }
    const dimensions = selectedTab.value.measuremenets

    return {
      left: withTiming(dimensions.x),
      bottom: 0,
      width: withTiming(dimensions.width),
    }
  })

  return <Animated.View style={[styles.indicator, stylez]} />
}
export function DynamicTab({
  selectedTabIndex = 0,
  onChangeTab,
}: {
  selectedTabIndex?: number
  onChangeTab?: (index: number) => void
}) {
  const scrollViewRef = useAnimatedRef<ScrollView>()
  const tabWithMeasurements = useSharedValue<TabWithMeasurements | null>(null)

  useAnimatedReaction(
    () => {
      return tabWithMeasurements.value
    },
    (selectedTab, prevSelectedTab) => {
      if (!selectedTab || !scrollViewRef) {
        return
      }
      const dimensions = selectedTab.measuremenets
      const scrollViewDimensions: MeasuredDimensions = measure(scrollViewRef)

      if (!scrollViewDimensions) {
        return
      }

      scrollTo(
        scrollViewRef,
        dimensions.x - (scrollViewDimensions.width - dimensions.width) / 2,
        0,
        // We don't want to animate the initial position of the scroll.
        prevSelectedTab !== null,
      )
      // Here, you can send the selected tab index to the parent via a callback
      if (onChangeTab && selectedTab.index !== prevSelectedTab?.index) {
        runOnJS(onChangeTab)(selectedTab.index)
      }
    },
    [selectedTabIndex],
  )

  return (
    <ScrollView
      horizontal
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ paddingVertical: 10 }}
      ref={scrollViewRef}
    >
      {tabsList.map((tab, index) => (
        <Tab
          key={`tab-${tab}-${index}`}
          name={tab}
          isActiveTabIndex={index === selectedTabIndex}
          onPress={(measuremenets) => {
            tabWithMeasurements.value = {
              index,
              measuremenets,
            }
          }}
        />
      ))}
      <Indicator selectedTab={tabWithMeasurements} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    backgroundColor: colorShades.purple.base,
    height: 4,
    borderRadius: 2,
  },
})

export function DynamicTabsLesson() {
  const { width } = useWindowDimensions()
  const [selectedTabIndex, setSelectedTabIndex] = useState(2)
  const ref = useRef<FlatList>(null)
  return (
    <Container>
      <DynamicTab
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
