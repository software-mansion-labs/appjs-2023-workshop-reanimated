import { Container } from '@components/Container'
import { alphabet, contacts } from '@lib/mock'
import { clamp, hitSlop } from '@lib/reanimated'
import { colorShades, layout } from '@lib/theme'
import { useRef } from 'react'
import {
  Image,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'

type AlphabetLetterProps = {
  index: number
  letter: string
  scrollableIndex: SharedValue<number>
  onPress: () => void
}

const AlphabetLetter = ({
  index,
  letter,
  scrollableIndex,
  onPress,
}: AlphabetLetterProps) => {
  const posY = useSharedValue(0)
  const styles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollableIndex.value,
        [index - 1, index, index + 1],
        [0.5, 1, 0.5],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            scrollableIndex.value,
            [index - 2, index, index + 2],
            [1, 1.5, 1],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }
  })
  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={[
          {
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          },
          styles,
        ]}
        onLayout={(e) => {
          posY.value = e.nativeEvent.layout.y
        }}
      >
        <Animated.Text
          style={[
            {
              position: 'absolute',
              fontFamily: 'Menlo',
              left: -20,
              fontWeight: '900',
            },
          ]}
        >
          {alphabet.charAt(index).toUpperCase()}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

const getItemLayout = sectionListGetItemLayout({
  getItemHeight: () => layout.avatarSize + layout.spacing * 2,
  getSectionHeaderHeight: () => 50,
})

export function ScrollAnimationLesson() {
  const y = useSharedValue(0)
  const scrollableIndex = useSharedValue(0)
  const isActive = useSharedValue(false)
  const activeScrollIndex = useSharedValue(0)
  const knobScale = useDerivedValue(() => {
    return withSpring(isActive.value ? 1 : 0)
  })

  const alphabetRef = useAnimatedRef<View>()
  const scrollViewRef = useRef<SectionList>(null)

  const snapIndicatorTo = (index: number) => {
    runOnUI(() => {
      'worklet'

      if (scrollableIndex.value === index || isActive.value) {
        return
      }

      const alphabetLayout = measure(alphabetRef)
      if (!alphabetLayout) {
        return
      }
      const snapBy =
        (alphabetLayout.height - layout.knobSize) / (alphabet.length - 1)
      const snapTo = index * snapBy
      y.value = withTiming(snapTo)
      scrollableIndex.value = withTiming(index)
    })()
  }

  const scrollToLocation = (index: number) => {
    scrollViewRef.current?.scrollToLocation({
      itemIndex: 0,
      sectionIndex: index,
      animated: true,
      viewOffset: 0,
      viewPosition: 0.5,
    })
  }

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onBegin(() => {
      isActive.value = true
    })
    .onChange((ev) => {
      const alphabetLayout = measure(alphabetRef)
      if (!alphabetLayout) {
        return
      }
      y.value = clamp(
        (y.value += ev.changeY),
        alphabetLayout.y, // take into account the knob size
        alphabetLayout.height - layout.knobSize,
      )
      // This is snapTo by the same interval. This will snap to the nearest
      // letter based on the knob position.
      const snapBy =
        (alphabetLayout.height - layout.knobSize) / (alphabet.length - 1)
      const snapToIndex = Math.round(y.value / snapBy)

      scrollableIndex.value = y.value / snapBy
      // Ensure that we don't trigger scroll to the same index.
      if (snapToIndex === activeScrollIndex.value) {
        return
      }

      // This is to avoid triggering scrolling to the same index.
      activeScrollIndex.value = snapToIndex

      runOnJS(scrollToLocation)(snapToIndex)
    })
    .onEnd(() => {
      runOnJS(snapIndicatorTo)(activeScrollIndex.value)
    })
    .onFinalize(() => {
      isActive.value = false
    })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: interpolate(
        knobScale.value,
        [0, 1],
        [layout.knobSize / 2, 2],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          translateY: y.value,
        },
        {
          scale: knobScale.value + 1,
        },
      ],
    }
  })

  return (
    <Container centered={false}>
      <View style={{ flex: 1 }}>
        <SectionList
          contentContainerStyle={{ paddingHorizontal: 40 }}
          ref={scrollViewRef}
          stickySectionHeadersEnabled={false}
          // @ts-ignore
          getItemLayout={getItemLayout}
          // viewabilityConfig={{
          //   minimumViewTime: 100,
          //   itemVisiblePercentThreshold: 100,
          // }}
          onViewableItemsChanged={({ viewableItems }) => {
            const half = Math.floor(viewableItems.length / 2)
            const section = viewableItems[half]?.section
            if (!section) {
              return
            }
            const { index } = section
            snapIndicatorTo(index)
          }}
          sections={contacts}
          renderSectionHeader={({ section: { title } }) => {
            return (
              <View style={{ height: 50 }}>
                <Text
                  style={{
                    fontSize: 42,
                    fontWeight: '900',
                  }}
                >
                  {title}
                </Text>
              </View>
            )
          }}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: layout.spacing,
                  height: layout.avatarSize + layout.spacing * 2,
                }}
              >
                <Image
                  source={{ uri: item.avatar }}
                  style={{
                    marginRight: 10,
                    width: layout.avatarSize,
                    height: layout.avatarSize,
                    borderRadius: layout.avatarSize / 2,
                  }}
                />
                <Text>{item.name}</Text>
              </View>
            )
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: layout.indicatorSize,
            bottom: layout.indicatorSize,
          }}
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[styles.knob, animatedStyle]}
              hitSlop={hitSlop}
            />
          </GestureDetector>
          <View
            style={{
              transform: [{ translateX: -layout.indicatorSize / 4 }],
              flex: 1,
              width: 20,
              justifyContent: 'space-around',
            }}
            pointerEvents="box-none"
            ref={alphabetRef}
          >
            {[...Array(alphabet.length).keys()].map((i) => {
              return (
                <AlphabetLetter
                  key={i}
                  letter={alphabet.charAt(i)}
                  index={i}
                  scrollableIndex={scrollableIndex}
                  onPress={() => {
                    scrollToLocation(i)
                    snapIndicatorTo(i)
                  }}
                />
              )
            })}
          </View>
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  knob: {
    width: layout.knobSize,
    height: layout.knobSize,
    borderRadius: layout.knobSize / 2,
    backgroundColor: '#fff',
    borderWidth: layout.knobSize / 2,
    borderColor: colorShades.purple.base,
    position: 'absolute',
    left: -layout.knobSize / 2,
  },
})
