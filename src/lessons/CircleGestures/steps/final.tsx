import { StyleSheet, View } from 'react-native'
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

import { clamp } from '../../../lib/reanimated'

const _knobSize = 24

export function CircleGesturesFinal() {
  const scale = useSharedValue(1)
  const x = useSharedValue(0)
  const progress = useSharedValue(0)

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(2)
    })
    .onEnd(() => {
      scale.value = withSpring(1)
    })

  tapGesture.config = {
    hitSlop: {
      left: 50,
      bottom: 50,
      right: 50,
      top: 50,
    },
  }
  const aRef = useAnimatedRef<View>()

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onChange((ev) => {
      const size = measure(aRef)
      x.value = clamp((x.value += ev.changeX), 0, size.width)
      progress.value = 100 * (x.value / size.width)
    })
    .onEnd(() => {
      scale.value = withSpring(1)
    })
  const gestures = Gesture.Simultaneous(tapGesture, panGesture)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: interpolate(
        scale.value,
        [1, 2],
        [_knobSize / 2, 2],
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
  const indicator = useAnimatedStyle(() => {
    return {
      height: 5,
      width: x.value,
      backgroundColor: '#683FC2dd',
      position: 'absolute',
    }
  })
  return (
    <GestureDetector gesture={gestures}>
      <View ref={aRef} style={styles.slider}>
        <Animated.View style={indicator} />
        <Animated.View style={[styles.knob, animatedStyle]} />
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  knob: {
    width: _knobSize,
    height: _knobSize,
    borderRadius: _knobSize / 2,
    backgroundColor: '#fff',
    borderWidth: _knobSize / 2,
    borderColor: '#683FC2',
    position: 'absolute',
    left: -_knobSize / 2,
  },
  slider: {
    width: '50%',
    backgroundColor: '#683FC255',
    height: 5,
    justifyContent: 'center',
  },
})
