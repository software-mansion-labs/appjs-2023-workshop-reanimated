import { images } from '@lib/mock'
import { layout } from '@lib/theme'
import type { SharedElementTransitionDndRoutes } from '@navigation/Routes'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

export function SharedElementTransitionDndHome(): React.ReactElement {
  const navigation =
    useNavigation<NavigationProp<SharedElementTransitionDndRoutes>>()

  return (
    <View style={[styles.container]}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={images}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('SharedElementTransitionDndDetail', {
                item,
              })
            }
          >
            <Animated.Image
              sharedTransitionTag={'image-' + item.id}
              source={{ uri: item.originalUri }}
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
