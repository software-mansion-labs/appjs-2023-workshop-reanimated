import type { SharedElementTransitionDndRoutes } from '@navigation/Routes'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import { SharedElementTransitionDndDetail } from './Details'
import { SharedElementTransitionDndHome } from './Home'

const Stack = createNativeStackNavigator<SharedElementTransitionDndRoutes>()

export function SharedElementTransitionDnd() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SharedElementTransitionDndHome"
        component={SharedElementTransitionDndHome}
      />
      <Stack.Screen
        name="SharedElementTransitionDndDetail"
        component={SharedElementTransitionDndDetail}
      />
    </Stack.Navigator>
  )
}
