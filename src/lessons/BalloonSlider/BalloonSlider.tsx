import { AnimatedText } from '@components/AnimatedText'
import { Container } from '@components/Container'
import { clamp, hitSlop } from '@lib/reanimated'
import { colorShades, layout } from '@lib/theme'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  SensorType,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const minAngleToActivateSensor = 5 //in degrees
const pointsPerAngle = 0.2

export function BalloonSliderLesson() {
  const x = useSharedValue(0)
  const progress = useSharedValue(0)
  const isInteracting = useSharedValue(false)
  const knobScale = useDerivedValue(() => {
    return withSpring(isInteracting.value ? 1 : 0)
  })
  const { sensor } = useAnimatedSensor(SensorType.ROTATION, {
    interval: 100,
  })
  const aRef = useAnimatedRef<View>()

  useDerivedValue(() => {
    if (isInteracting.value || !aRef) {
      return
    }
    // Angle is max ~90deg
    const angle = sensor.value.roll * (180 / Math.PI)
    if (Math.abs(angle) < minAngleToActivateSensor) {
      // isInteracting.value = false
      return
    }
    const size = measure(aRef)
    const countValue = angle * pointsPerAngle

    // isInteracting.value = true
    x.value = clamp((x.value += countValue), 0, size.width)
    progress.value = 100 * (x.value / size.width)
  })

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .activateAfterLongPress(1)
    .onBegin(() => {
      isInteracting.value = true
    })
    .onChange((ev) => {
      const size = measure(aRef)
      x.value = clamp((x.value += ev.changeX), 0, size.width)
      progress.value = 100 * (x.value / size.width)
    })
    .onEnd(() => {
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

  const balloonSpringyX = useDerivedValue(() => {
    return withSpring(x.value)
  })

  const balloonAngle = useDerivedValue(() => {
    return (
      90 +
      (Math.atan2(-layout.indicatorSize * 2, balloonSpringyX.value - x.value) *
        180) /
        Math.PI
    )
  })

  const balloonStyle = useAnimatedStyle(() => {
    return {
      opacity: knobScale.value,
      transform: [
        { translateX: balloonSpringyX.value },
        { scale: knobScale.value },
        {
          translateY: interpolate(
            knobScale.value,
            [0, 1],
            [0, -layout.indicatorSize],
          ),
        },
        {
          rotate: `${balloonAngle.value}deg`,
        },
      ],
    }
  })

  return (
    <Container>
      <GestureDetector gesture={panGesture}>
        <View ref={aRef} style={styles.slider} hitSlop={hitSlop}>
          <Animated.View style={[styles.balloon, balloonStyle]}>
            <View style={styles.textContainer}>
              <AnimatedText
                text={progress}
                style={{ color: 'white', fontWeight: '600' }}
              />
            </View>
          </Animated.View>
          <Animated.View style={[styles.progress, { width: x }]} />
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
