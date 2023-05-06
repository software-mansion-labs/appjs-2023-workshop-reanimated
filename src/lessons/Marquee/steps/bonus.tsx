import { Container } from '@components/Container'
import { Creators, WorkshopTagLine } from '@components/MockData'
import * as React from 'react'
import { View, ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import type { SharedValue } from 'react-native-reanimated'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated'

export function MarqueeLesson() {
  return (
    <Container>
      <Marquee spacing={0} style={{ width: '100%' }} speed={0.5}>
        <Creators />
      </Marquee>
      <Marquee spacing={30} style={{ width: '100%' }} speed={1}>
        <WorkshopTagLine />
      </Marquee>
      <Marquee spacing={20} style={{ width: '100%' }} speed={2}>
        <WorkshopTagLine />
      </Marquee>
      <Marquee spacing={10} style={{ width: '100%' }} speed={3}>
        <WorkshopTagLine />
      </Marquee>
    </Container>
  )
}

/**
 * Used to animate the given children in a horizontal manner.
 */
const Marquee = React.memo(
  ({
    speed = 1,
    children,
    spacing = 0,
    style,
  }: React.PropsWithChildren<{
    speed?: number
    spacing?: number
    style?: ViewStyle
  }>) => {
    const parentWidth = useSharedValue(0)
    const cloneWidth = useSharedValue(0)
    const [cloneTimes, setCloneTimes] = React.useState(0)
    const anim = useSharedValue(0)

    const frame = useFrameCallback(() => {
      anim.value += speed
    }, true)

    const setFrame = (state: boolean) => {
      frame.setActive(state)
    }

    useAnimatedReaction(
      () => {
        if (cloneWidth.value === 0 || parentWidth.value === 0) {
          return 0
        }
        return Math.ceil(parentWidth.value / cloneWidth.value)
      },
      (v) => {
        if (v === 0) {
          return
        }
        // This is going to cover the case when the text/element size
        // is greater than the actual parent size
        // Double this to cover the entire screen twice, in this way we can
        // reset the position of the first element when its going to move out
        // of the screen without any noticible glitch
        runOnJS(setCloneTimes)(v * 2)
      },
    )

    const gesture = Gesture.Pan()
      .onBegin(() => {
        runOnJS(setFrame)(false)
      })
      .onFinalize(() => {
        runOnJS(setFrame)(true)
      })
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={style}
          onLayout={(ev) => {
            parentWidth.value = ev.nativeEvent.layout.width
          }}
        >
          <Animated.View style={{ flexDirection: 'row', overflow: 'hidden' }}>
            {
              // We are adding the text inside a ScrollView because in this way we
              // ensure that its not going to "wrap".
            }
            <Animated.ScrollView horizontal style={{ opacity: 0 }}>
              <View
                style={{
                  flexDirection: 'row',
                }}
                onLayout={(ev) => {
                  cloneWidth.value = ev.nativeEvent.layout.width
                }}
              >
                {children}
              </View>
            </Animated.ScrollView>
            {cloneTimes > 0 &&
              [...Array(cloneTimes).keys()].map((index) => {
                return (
                  <AnimatedClone
                    key={`clone-${index}`}
                    index={index}
                    anim={anim}
                    cloneWidth={cloneWidth}
                    spacing={spacing}
                  >
                    {children}
                  </AnimatedClone>
                )
              })}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    )
  },
)

const AnimatedClone = ({
  index,
  children,
  anim,
  cloneWidth,
  spacing,
}: React.PropsWithChildren<{
  index: number
  anim: SharedValue<number>
  cloneWidth: SharedValue<number>
  spacing: number
}>) => {
  const stylez = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: index * (cloneWidth.value + spacing),
      transform: [
        {
          translateX: -(anim.value % (cloneWidth.value + spacing)),
        },
      ],
    }
  }, [index, spacing, cloneWidth])
  return <Animated.View style={stylez}>{children}</Animated.View>
}
