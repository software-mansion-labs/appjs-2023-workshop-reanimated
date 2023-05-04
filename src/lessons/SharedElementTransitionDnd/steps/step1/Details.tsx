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
import Animated, { FadeIn } from 'react-native-reanimated'

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

  return (
    <View style={[styles.container]}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[styles.backdrop]}
      />
      <View style={[styles.content]}>
        <Animated.Image
          source={{ uri: activeItem.originalUri }}
          style={styles.image}
          sharedTransitionTag={'image-' + activeItem.id}
        />
        <Content />
        <Button title="go back" onPress={goBack} />
      </View>
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
