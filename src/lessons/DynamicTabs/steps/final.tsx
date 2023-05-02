import { Container } from '@components/Container'
import { tabsList } from '@lib/mock'
import { hitSlop } from '@lib/reanimated'
import { colorShades } from '@lib/theme'
import { forwardRef, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import type { MeasuredDimensions } from 'react-native-reanimated/src/reanimated2/commonTypes'

type TabsProps = {
  name: string
  onPress: () => void
  isActiveTabIndex: boolean
}

const Tab = forwardRef<View, TabsProps>(
  ({ isActiveTabIndex, name, onPress }, ref) => {
    return (
      <View
        style={{ marginHorizontal: 4, paddingVertical: 10 }}
        ref={ref}
        onLayout={() => {
          // This is needed because we can't send the initial render measurements
          // without hooking into `onLayout`.
          if (isActiveTabIndex) {
            onPress()
          }
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          hitSlop={hitSlop}
          style={{ marginHorizontal: 8 }}
        >
          <Text>{name}</Text>
        </TouchableOpacity>
      </View>
    )
  },
)

function Indicator({
  tabMeasurements,
}: {
  tabMeasurements: SharedValue<MeasuredDimensions | null>
}) {
  const stylez = useAnimatedStyle(() => {
    if (!tabMeasurements?.value) {
      return {}
    }

    return {
      left: withTiming(tabMeasurements.value.x),
      bottom: 0,
      width: withTiming(tabMeasurements.value.width),
    }
  })

  return <Animated.View style={[styles.indicator, stylez]} />
}
export function DynamicTabsLesson({
  selectedTabIndex = 0,
  onChangeTab,
}: {
  selectedTabIndex?: number
  onChangeTab?: (index: number) => void
}) {
  const scrollViewRef = useAnimatedRef<ScrollView>()
  const tabMeasurements = useSharedValue<MeasuredDimensions | null>(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tabRefs = tabsList.map(() => useAnimatedRef<View>())

  const changeSelectedTab = useCallback(
    (index: number) => {
      runOnUI(() => {
        'worklet'
        if (!tabRefs[index] || !scrollViewRef) {
          return
        }

        const measurements = measure(tabRefs[index]!)
        const scrollViewDimensions: MeasuredDimensions = measure(scrollViewRef)

        if (!scrollViewDimensions || !measurements) {
          return
        }

        scrollTo(
          scrollViewRef,
          measurements.x -
            (scrollViewDimensions.width - measurements.width) / 2,
          0,
          true,
        )
        tabMeasurements.value = measurements
        // Here, you can send the selected tab index to the parent via a
        // callback
        if (onChangeTab) {
          runOnJS(onChangeTab)(index)
        }
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChangeTab, selectedTabIndex],
  )
  useEffect(() => {
    changeSelectedTab(selectedTabIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabIndex])

  return (
    <Container>
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
            ref={tabRefs[index]}
            isActiveTabIndex={index === selectedTabIndex}
            onPress={() => {
              changeSelectedTab(index)
            }}
          />
        ))}
        <Indicator tabMeasurements={tabMeasurements} />
      </ScrollView>
    </Container>
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
