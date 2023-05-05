import { AnimatedText } from '@components/AnimatedText'
import { Container } from '@components/Container'
import { clamp, hitSlop } from '@lib/reanimated'
import { colorShades, layout } from '@lib/theme'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  SensorType,
  defineAnimation,
  interpolate,
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const GRAVITY = 0.001

function withGravity(userConfig) {
  'worklet'
  return defineAnimation(0, () => {
    'worklet'
    const config = {
      acceleration: 0.998,
      velocity: 0,
    }
    Object.assign(config, userConfig)
    return {
      onStart: (animation, value, now, previousAnimation) => {
        animation.current = value
        animation.lastTimestamp = previousAnimation?.lastTimestamp ?? now
        animation.velocity = previousAnimation?.velocity ?? config.velocity
      },
      onFrame: (animation, now) => {
        const { lastTimestamp, current, velocity } = animation
        const { acceleration, clamp } = config
        const delta = now - lastTimestamp
        animation.current = current + velocity * delta
        animation.velocity = velocity + acceleration * delta

        animation.lastTimestamp = now
        if (clamp) {
          if (animation.current <= clamp[0]) {
            animation.current = clamp[0]
            if (animation.velocity <= 0) {
              animation.velocity = 0
              return true
            }
          } else if (animation.current >= clamp[1]) {
            animation.current = clamp[1]
            if (animation.velocity >= 0) {
              animation.velocity = 0
              return true
            }
          }
        }
        return false
      },
    }
  })
}

export function BaloonSliderLesson() {
  const x = useSharedValue(0)
  const progress = useSharedValue(0)
  const isTouching = useSharedValue(true)
  const knobScale = useSharedValue(0)
  const { sensor } = useAnimatedSensor(SensorType.ROTATION, {
    interval: 100,
  })
  const aRef = useAnimatedRef<View>()

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .activateAfterLongPress(1)
    .onBegin(() => {
      isTouching.value = true
    })
    .onStart(() => {
      knobScale.value = withSpring(1)
    })
    .onChange((ev) => {
      const size = measure(aRef)
      x.value = clamp((x.value += ev.changeX), 0, size.width)
      progress.value = 100 * (x.value / size.width)
    })
    .onEnd(() => {
      knobScale.value = withSpring(0)
    })
    .onFinalize(() => {
      isTouching.value = false
    })

  useAnimatedReaction(
    () => {
      return isTouching.value ? 0 : GRAVITY * Math.sin(sensor.value.roll)
    },
    (gravity) => {
      if (gravity != 0) {
        x.value = withGravity({ clamp: [0, 300], acceleration: gravity })
      }
    },
  )

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
