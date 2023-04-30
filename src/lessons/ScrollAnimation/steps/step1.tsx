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
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

type AlphabetLetterProps = {
  index: number
  letter: string
}

const AlphabetLetter = ({ index, letter }: AlphabetLetterProps) => {
  const posY = useSharedValue(0)
  return (
    <Animated.View
      style={[
        {
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
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
        0 - layout.knobSize / 2, // take into account the knob size
        alphabetLayout.height - layout.knobSize / 2,
      )
    })
    .onEnd(() => {
      const alphabetLayout = measure(alphabetRef)
      if (!alphabetLayout) {
        return
      }
      // This is snapTo by the same interval. This will snap to the nearest
      // letter based on the knob position.
      const snapBy = alphabetLayout.height / (alphabet.length - 1)
      const snapTo = Math.round(y.value / snapBy) * snapBy
      y.value = withSpring(snapTo + layout.knobSize / 2)
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
        <ScrollView contentContainerStyle={{ paddingHorizontal: 40 }}>
          {contacts.map(({ index, section, data }) => {
            return (
              <Animated.View key={`${section}-${index}`}>
                <Text
                  onLayout={(e) => {}}
                  style={{
                    fontSize: 42,
                    marginVertical: 10,
                    fontWeight: '900',
                  }}
                >
                  {section}
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
              </Animated.View>
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
              justifyContent: 'space-between',
            }}
            pointerEvents="box-none"
            ref={alphabetRef}
          >
            {[...Array(alphabet.length).keys()].map((i) => {
              return (
                <AlphabetLetter key={i} letter={alphabet.charAt(i)} index={i} />
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
