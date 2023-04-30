import { CircleGesturesLesson } from '@lessons/CircleGestures'
import { MarqueeLesson } from '@lessons/Marquee'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { StatusBar } from 'react-native'

import { HomeScreen } from './Home'
import type { Routes } from './Routes'
import { BaloonSliderLesson } from '../lessons/BaloonSlider/BaloonSlider'
import { DynamicTabsLesson } from '../lessons/DynamicTabs/DynamicTabs'
import { ScrollAnimationLesson } from '../lessons/ScrollAnimation/ScrollAnimation'

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
      <Stack.Screen name="BaloonSliderLesson" component={BaloonSliderLesson} />
      <Stack.Screen
        name="ScrollAnimationLesson"
        component={ScrollAnimationLesson}
      />
      <Stack.Screen name="DynamicTabsLesson" component={DynamicTabsLesson} />
      <Stack.Screen name="MarqueeLesson" component={MarqueeLesson} />
    </Stack.Navigator>
  )
}
