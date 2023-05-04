import { Content } from '@components/Content'
import type { SharedElementTransitionDndRoutes } from '@navigation/Routes'
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import React from 'react'
import { Button, Dimensions, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('screen')

const _overdrag = width / 2

export function SharedElementTransitionDndDetail() {
  const navigation =
    useNavigation<NavigationProp<SharedElementTransitionDndRoutes>>()
  const route =
    useRoute<
      RouteProp<
        SharedElementTransitionDndRoutes,
        'SharedElementTransitionDndDetail'
      >
    >()

  const activeItem = route.params.item

  const goBack = () => {
    navigation.goBack()
  }

  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  }

  const distance = useDerivedValue(() => {
    return Math.abs(translation.x.value) + Math.abs(translation.y.value)
  })

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translation.x.value += event.changeX
      translation.y.value += event.changeY
    })
    .onEnd(() => {
      if (distance.value > _overdrag) {
        runOnJS(goBack)()
      } else {
        translation.x.value = withSpring(0, { overshootClamping: true })
        translation.y.value = withSpring(0, { overshootClamping: true })
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translation.x.value },
      { translateY: translation.y.value },
      {
        scale: interpolate(
          distance.value,
          [0, _overdrag * 2],
          [1, 0.5],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      distance.value,
      [0, _overdrag],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }))

  return (
    <View style={[styles.container]}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[styles.backdrop, backdropStyle]}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <Animated.Image
            source={{ uri: activeItem.originalUri }}
            style={styles.image}
            sharedTransitionTag={'image-' + activeItem.id}
          />
          <Content />
          <Button title="go back" onPress={goBack} />
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  image: {
    height: height / 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
})
