import { images } from '@lib/mock'
import { layout } from '@lib/theme'
import type { SharedElementTransitionDndRoutes } from '@navigation/Routes'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

export function SharedElementTransitionDndHome(): React.ReactElement {
  const nav = useNavigation<NavigationProp<SharedElementTransitionDndRoutes>>()

  return (
    <View style={[styles.container]}>
      <Animated.FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={images}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              nav.navigate('SharedElementTransitionDndHomeDetail', { item })
            }
          >
            <Animated.Image
              sharedTransitionTag={'image-' + item.id}
              source={{ uri: item.thumbnailUri }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: layout.spacing,
  },
  image: {
    width: '100%',
    height: layout.imageHeight,
    marginBottom: layout.spacing,
    borderRadius: layout.radius,
  },
})
