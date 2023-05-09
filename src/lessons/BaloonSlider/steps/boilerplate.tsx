import { Container } from '@components/Container'
import { hitSlop } from '@lib/reanimated'
import { colorShades, layout } from '@lib/theme'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

export function BaloonSliderLesson() {
  const x = useSharedValue(0)
  const isInteracting = useSharedValue(false)
  const knobScale = useDerivedValue(() => {
    return withSpring(isInteracting.value ? 1 : 0)
  })

  const aRef = useAnimatedRef<View>()

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onBegin(() => {
      isInteracting.value = true
    })
    .onChange((ev) => {
      x.value += ev.changeX
    })
    .onFinalize(() => {
      isInteracting.value = false
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
          translateX: x.value,
        },
        {
          scale: knobScale.value + 1,
        },
      ],
    }
  })

  return (
    <Container>
      <GestureDetector gesture={panGesture}>
        <View ref={aRef} style={styles.slider} hitSlop={hitSlop}>
          <Animated.View style={[styles.knob, animatedStyle]} />
        </View>
      </GestureDetector>
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
  slider: {
    width: '80%',
    backgroundColor: colorShades.purple.light,
    height: 5,
    justifyContent: 'center',
  },
  textContainer: {
    width: 40,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorShades.purple.base,
    position: 'absolute',
    top: -layout.knobSize,
  },
  balloon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 4,
    height: layout.indicatorSize,
    bottom: -layout.knobSize / 2,
    borderRadius: 2,
    backgroundColor: colorShades.purple.base,
    position: 'absolute',
  },
  progress: {
    height: 5,
    backgroundColor: colorShades.purple.dark,
    position: 'absolute',
  },
})
