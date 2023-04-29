/* global _WORKLET */
import { memo, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
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

import { tabsList } from '../../../lib/mock'
import { hitSlop } from '../../../lib/reanimated'
import { colorShades } from '../../../lib/theme'

type MeasureDimensions = {
  x: number
  y: number
  width: number
  height: number
  pageX: number
  pageY: number
}

type TabsProps = {
  name: string
  onPress: (measurements: MeasureDimensions) => void
  isActiveTabIndex: boolean
}

type TabWithMeasurements = {
  index: number
  measuremenets: MeasureDimensions
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
      top: withTiming(dimensions.y + dimensions.height),
      width: withTiming(dimensions.width),
    }
  })

  return <Animated.View style={[styles.indicator, stylez]} />
}
export function DynamicTabsFinal({
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
      const scrollViewDimensions: MeasureDimensions = measure(scrollViewRef)

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
    <View>
      <ScrollView
        horizontal
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingVertical: 20 }}
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
    </View>
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
