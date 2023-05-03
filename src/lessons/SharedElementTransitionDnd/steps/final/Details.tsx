import { Content } from '@components/Content'
import { layout } from '@lib/theme'
import type { SharedElementTransitionDndRoutes } from '@navigation/Routes'
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import React from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const _overdrag = 100

export function SharedElementTransitionDndDetail() {
  const navigation =
    useNavigation<NavigationProp<SharedElementTransitionDndRoutes>>()
  const route =
    useRoute<
      RouteProp<
        SharedElementTransitionDndRoutes,
        'SharedElementTransitionDndHomeDetail'
      >
    >()

  const activeItem = route.params.item
  const { height } = useWindowDimensions()

  const goBack = () => {
    navigation.goBack()
  }

  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
    scale: useSharedValue(1),
  }

  const panGeture = Gesture.Pan()
    .onChange((event) => {
      translation.x.value += event.changeX
      translation.y.value += event.changeY
    })
    .onEnd(() => {
      if (
        Math.abs(translation.x.value) + Math.abs(translation.y.value) >
        _overdrag
      ) {
        runOnJS(goBack)()
      } else {
        translation.x.value = withSpring(0, { overshootClamping: true })
        translation.y.value = withSpring(0, { overshootClamping: true })
      }
    })

  const borderRadiusStyle = useAnimatedStyle(() => {
    return {
      borderRadius: interpolate(
        Math.abs(translation.x.value) + Math.abs(translation.y.value),
        [0, _overdrag],
        [0, layout.radius],
        Extrapolate.CLAMP,
      ),
    }
  })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translation.x.value },
      { translateY: translation.y.value },
      {
        scale:
          1 -
          (Math.abs(translation.x.value) + Math.abs(translation.y.value)) /
            height,
      },
    ],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity:
      1 -
      (Math.abs(translation.x.value) + Math.abs(translation.y.value)) /
        (_overdrag * 2),
  }))

  return (
    <View style={[styles.container]}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'black' },
          backdropStyle,
        ]}
      />
      <GestureDetector gesture={panGeture}>
        <Animated.View
          style={[
            animatedStyle,
            borderRadiusStyle,
            { backgroundColor: '#fff', flex: 1, overflow: 'hidden' },
          ]}
        >
          <View style={{ height: height / 2, width: '100%' }}>
            <Animated.Image
              source={{ uri: activeItem.originalUri }}
              style={[StyleSheet.absoluteFillObject]}
              sharedTransitionTag={'image-' + activeItem.id}
            />
          </View>
          <Content />
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
})
