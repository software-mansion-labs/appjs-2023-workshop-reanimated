import { Container } from '@components/Container'
import { tabsList } from '@lib/mock'
import { hitSlop } from '@lib/reanimated'
import { colorShades, layout } from '@lib/theme'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveTabIndex])

  return (
    <View
      style={styles.tab}
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
  selectedTabMeasurements,
}: {
  selectedTabMeasurements: SharedValue<MeasuredDimensions | null>
}) {
  const stylez = useAnimatedStyle(() => {
    if (!selectedTabMeasurements?.value) {
      return {}
    }

    const { x, width } = selectedTabMeasurements.value

    return {
      left: withTiming(x),
      bottom: 0,
      width: withTiming(width),
    }
  })

  return <Animated.View style={[styles.indicator, stylez]} />
}
function DynamicTabs({
  selectedTabIndex = 0,
  onChangeTab,
}: {
  selectedTabIndex?: number
  onChangeTab?: (index: number) => void
}) {
  const scrollViewRef = useAnimatedRef<ScrollView>()
  const tabMeasurements = useSharedValue<MeasuredDimensions | null>(null)

  const scrollToTab = (index: number) => {
    runOnUI(() => {
      'worklet'

      const scrollViewDimensions: MeasuredDimensions = measure(scrollViewRef)

      if (!scrollViewDimensions || !tabMeasurements.value) {
        return
      }

      scrollTo(
        scrollViewRef,
        tabMeasurements.value.x -
          (scrollViewDimensions.width - tabMeasurements.value.width) / 2,
        0,
        true,
      )
      // Here, you can send the selected tab index to the parent via a callback
      if (onChangeTab) {
        runOnJS(onChangeTab)(index)
      }
    })()
  }

  return (
    <ScrollView
      horizontal
      style={{ flexGrow: 0 }}
      contentContainerStyle={styles.scrollViewContainer}
      ref={scrollViewRef}
    >
      {tabsList.map((tab, index) => (
        <Tab
          key={`tab-${tab}-${index}`}
          name={tab}
          isActiveTabIndex={index === selectedTabIndex}
          onPress={(measurements) => {
            // setActiveIndex(index)
            tabMeasurements.value = measurements
            scrollToTab(index)
          }}
        />
      ))}
      <Indicator selectedTabMeasurements={tabMeasurements} />
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
  tab: {
    marginHorizontal: layout.spacing,
  },
  scrollViewContainer: {
    paddingVertical: layout.spacing * 2,
  },
})

export function DynamicTabsLesson() {
  const { width } = useWindowDimensions()
  const [selectedTabIndex, setSelectedTabIndex] = useState(2)
  const ref = useRef<FlatList>(null)
  return (
    <Container>
      <DynamicTabs
        selectedTabIndex={selectedTabIndex}
        onChangeTab={(index) => {
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
