import { CircleGesturesLesson } from '@lessons/CircleGestures'
import { MarqueeLesson } from '@lessons/Marquee'
import { SharedElementTransitionDnd } from '@lessons/SharedElementTransitionDnd'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { StatusBar } from 'react-native'

import { ArcLesson } from '../lessons/Arc/Arc'
import { BalloonSliderLesson } from '../lessons/BalloonSlider/BalloonSlider'
import { DynamicTabsLesson } from '../lessons/DynamicTabs/DynamicTabs'
import { ScrollAnimationLesson } from '../lessons/ScrollAnimation/ScrollAnimation'
import { HomeScreen } from './Home'
import type { Routes } from './Routes'

const Stack = createNativeStackNavigator<Routes>()

export function MainNavigator() {
  useEffect(() => {
    StatusBar.setBarStyle('dark-content')
  }, [])

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerBlurEffect: 'light',
        statusBarTranslucent: true,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CircleGesturesLesson"
        component={CircleGesturesLesson}
      />
      <Stack.Screen
        name="BalloonSliderLesson"
        component={BalloonSliderLesson}
      />
      <Stack.Screen name="MarqueeLesson" component={MarqueeLesson} />
      <Stack.Screen name="DynamicTabsLesson" component={DynamicTabsLesson} />
      <Stack.Screen
        name="ScrollAnimationLesson"
        component={ScrollAnimationLesson}
      />
      <Stack.Screen
        name="SharedElementTransitionDnd"
        component={SharedElementTransitionDnd}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ArcLesson"
        component={ArcLesson}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
