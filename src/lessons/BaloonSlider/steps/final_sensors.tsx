import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  SensorType,
  useAnimatedRef,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { AnimatedText } from '../../../components/AnimatedText'
import { clamp } from '../../../lib/reanimated'
import { colorShades, layout } from '../../../lib/theme'

const minAngleToActivateSensor = 5 //in degrees
const pointsPerAngle = 0.2

export function BaloonSliderStepFinalSensors() {
  const scale = useSharedValue(1)
  const x = useSharedValue(0)
  const progress = useSharedValue(0)
  const balloonScale = useSharedValue(0)
  const isSensorActive = useSharedValue(true)
  const { sensor } = useAnimatedSensor(SensorType.ROTATION, {
    interval: 100,
  })
  const aRef = useAnimatedRef<View>()

  useDerivedValue(() => {
    if (!isSensorActive.value || !aRef) {
      return
    }
    // Angle is max ~90deg
    const angle = sensor.value.roll * (180 / Math.PI)
    if (Math.abs(angle) < minAngleToActivateSensor) {
      scale.value = withSpring(1)
      balloonScale.value = withSpring(0)
      return
    }
    const size = measure(aRef)
    const countValue = angle * pointsPerAngle

    x.value = clamp((x.value += countValue), 0, size.width)
    progress.value = 100 * (x.value / size.width)
    scale.value = withSpring(2)
    balloonScale.value = withSpring(1)
  })

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      isSensorActive.value = false
      scale.value = withSpring(2)
      balloonScale.value = withSpring(1)
    })
    .onEnd(() => {
      isSensorActive.value = true
      scale.value = withSpring(1)
      balloonScale.value = withSpring(0)
    })

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onChange((ev) => {
      isSensorActive.value = false
      const size = measure(aRef)
      x.value = clamp((x.value += ev.changeX), 0, size.width)
      progress.value = 100 * (x.value / size.width)
    })
    .onEnd(() => {
      isSensorActive.value = true
      scale.value = withSpring(1)
      balloonScale.value = withSpring(0)
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
          translateX: x.value,
        },
        {
          scale: scale.value,
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
      opacity: balloonScale.value,
      transform: [
        { translateX: balloonSpringyX.value },
        { scale: balloonScale.value },
        {
          translateY: interpolate(
            balloonScale.value,
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
    <GestureDetector gesture={gestures}>
      <View ref={aRef} style={styles.slider}>
        <Animated.View style={[styles.balloon, balloonStyle]}>
          <View style={styles.textContainer}>
            <AnimatedText
              text={progress}
              style={{ color: 'white', fontWeight: '600' }}
            />
          </View>
        </Animated.View>
        <Animated.View
          style={{
            height: 5,
            width: x,
            backgroundColor: colorShades.purple.dark,
            position: 'absolute',
          }}
        />
        <Animated.View style={[styles.knob, animatedStyle]} />
      </View>
    </GestureDetector>
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
})
