import { Container } from '@components/Container'
import { Creators, WorkshopTagLine } from '@components/MockData'
import * as React from 'react'
import { View, ViewStyle } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated, { useSharedValue } from 'react-native-reanimated'

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
  return <Animated.View>{children}</Animated.View>
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

    return (
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
    )
  },
)
