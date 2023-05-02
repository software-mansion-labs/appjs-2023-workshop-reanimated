import { Container } from '@components/Container'
import { tabsList } from '@lib/mock'
import { hitSlop } from '@lib/reanimated'
import { colorShades } from '@lib/theme'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
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
export function DynamicTabs({
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
      <DynamicTabs
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
