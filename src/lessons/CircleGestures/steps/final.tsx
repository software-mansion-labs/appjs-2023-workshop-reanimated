import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { colorShades, layout } from '../../../lib/theme'

export function CircleGesturesStepFinal() {
  const scale = useSharedValue(1)
  const x = useSharedValue(0)

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(2)
    })
    .onEnd(() => {
      scale.value = withSpring(1)
    })

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onChange((ev) => {
      x.value += ev.changeX
    })
    .onEnd(() => {
      x.value = withSpring(0)
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
          translateX: x.value,
        },
        {
          scale: scale.value,
        },
      ],
    }
  })
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <GestureDetector gesture={gestures}>
        <Animated.View style={[styles.knob, animatedStyle]} />
      </GestureDetector>
    </View>
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
