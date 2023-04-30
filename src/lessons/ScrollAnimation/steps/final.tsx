import { Container } from '@components/Container'
import { alphabet, contacts } from '@lib/mock'
import { clamp, hitSlop } from '@lib/reanimated'
import { colorShades, layout } from '@lib/theme'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type AlphabetLetterProps = {
  index: number
  letter: string
  scrollableIndex: SharedValue<number>
}

const AlphabetLetter = ({
  index,
  letter,
  scrollableIndex,
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
            [index - 1.5, index, index + 1.5],
            [1, 1.5, 1],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }
  })
  return (
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
      {/* <Animated.View style={[styles.balloon]} /> */}
    </Animated.View>
  )
}

export function ScrollAnimationLesson() {
  const scale = useSharedValue(1)
  const y = useSharedValue(0)
  const alphabetRef = useAnimatedRef<View>()
  const scrollViewRef = useAnimatedRef<ScrollView>()
  const activeIndex = useSharedValue(0)
  const scrollableIndex = useSharedValue(0)

  const tapGesture = Gesture.Tap()
    .maxDuration(100000)
    .onBegin(() => {
      scale.value = withSpring(2)
    })
    .onEnd(() => {
      scale.value = withSpring(1)
    })

  const panGesture = Gesture.Pan()
    .averageTouches(true)
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
      const snapToIndex = Math.floor(y.value / snapBy)

      scrollableIndex.value = y.value / snapBy
      if (snapToIndex === activeIndex.value) {
        return
      }

      // This is to avoid triggering scrolling to the same index.
      activeIndex.value = snapToIndex
      if (contacts[snapToIndex]) {
        scrollTo(scrollViewRef, 0, contacts[snapToIndex]!.y.value, true)
      }
    })
    .onEnd(() => {
      const alphabetLayout = measure(alphabetRef)
      if (!alphabetLayout) {
        return
      }
      // This is snapTo by the same interval. This will snap to the nearest
      // letter based on the knob position.
      const snapBy =
        (alphabetLayout.height - layout.knobSize) / (alphabet.length - 1)
      const snapToIndex = Math.floor(y.value / snapBy)
      const snapTo = snapToIndex * snapBy
      y.value = withSpring(snapTo)
      scrollableIndex.value = withTiming(snapToIndex)
      scale.value = withSpring(1)
    })

  const gestures = Gesture.Simultaneous(tapGesture, panGesture)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: interpolate(
        scale.value,
        [1, 2],
        [layout.knobSize / 2, 2],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          translateY: y.value,
        },
        {
          scale: scale.value,
        },
      ],
    }
  })

  return (
    <Container centered={false}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 40 }}
          ref={scrollViewRef}
        >
          {contacts.map(({ index, title, data, y }) => {
            return (
              <View
                key={`${title}-${index}`}
                onLayout={(ev) => {
                  y.value = ev.nativeEvent.layout.y
                }}
              >
                <Text
                  style={{
                    fontSize: 42,
                    marginVertical: 10,
                    fontWeight: '900',
                  }}
                >
                  {title}
                </Text>
                {data.map((item, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                      }}
                      key={`${item.name}-${index}`}
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
                })}
              </View>
            )
          })}
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: layout.indicatorSize,
            bottom: layout.indicatorSize,
          }}
        >
          <GestureDetector gesture={gestures}>
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
