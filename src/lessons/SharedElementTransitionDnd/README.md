# Shared Element transition Drag'n'Drop

https://user-images.githubusercontent.com/2805320/236148130-0c679a8c-2ded-4fad-ba6f-945014a4332c.mp4

We're going to leverage the shared element functionality offered on any `Animated` component exposed by `Reanimated`.
In order to create a shared element transition, `reanimated` should know which element should be kept while navigation from a screen to another, `sharedTransitionTag` is the unique identifier share across navigation screens. If you have the an element that's sharing the same `sharedTransitionTag`, `reanimated` will match their geometry.

In this exercise we are going to use this `sharedTransitionTag` added to a list of images and when pressing on an image we are going to navigate to that entry details screen where we display the image and render some additional text. We are going to use `gestures` to control the going back navigation, so if the user will pan around the details image, after a particular threshold (`_overdrag`) we will call `navigation.goBack()`.

### Initial (boilerplate)

The boilerplate consist into:

- A screen that render a list of image, while pressing one an image, you'll be navigated to the details screen
- A details screen that render the image + some additional text.
- A **native** stack that will render the two screens from above.

https://user-images.githubusercontent.com/2805320/236148110-a61c9d47-565f-415d-aa5c-c8eca9c3ce67.mp4

## Step 1 - Just Shared Element transition (:

https://user-images.githubusercontent.com/2805320/236148115-fe872a2e-50b7-47e7-a221-7ca16f20a926.mp4

Let's now jump straight into the shared element transition. :) We are going to enable shared element transition to each individual image by passing just the `sharedTransitionTag`.

<details>
<summary>
  <b>[1]</b> Replace the `Image` from both screens with `Animated.Image`
</summary>

```tsx
<Animated.Image />
```

</details>
<br/>
<details>
<summary>
  <b>[2]</b> use `sharedTransitionTag` in both Home and Details screens

⚠️ Hint: Because we have a list of images, we need to define an unique tag for each individual image so that Reanimated will match them across different screens.
<br/>
⚠️ Hint2: When navigating from `Home -> Details`, we're sending the `item` as route param from where you can get the `id` and create the `sharedTransitionTag` that will match the one from the Home screen.

</summary>

```tsx
// Home Screen
<Animated.Image
  sharedTransitionTag={'image-' + item.id}
  // other image props
/>

// Details screen
<Animated.Image
  sharedTransitionTag={'image-' + activeItem.id}
  // other image props
/>
```

</details>
<br/>

## Step 2 - Pan gestures

https://user-images.githubusercontent.com/2805320/236148118-9030c016-4091-49f0-b10c-2eff2ad5a4c7.mp4

This step is where we enable `pan` gesture to the image from the details screen. For this step you'll need 2 shared values that will keep track of the `x` and `y` position, that are going to be changes by the `Gesture.Pan()`. When the gesture ends, go back to their initial values using a `spring` function. Based on `x` and `y` values, you can animate the `translateX` and `translateY` using `useAnimatedStyle`

<details>
<summary>
  <b>[1]</b> Create the shared values for `x` and `y`
</summary>

```jsx
const translation = {
  x: useSharedValue(0),
  y: useSharedValue(0),
}
```

</details>
<br/>
<details>
<summary>
  <b>[2]</b> Create the `panGesture`, modify `x` and `y` for `onChange` and come back to `0` `.onEnd`
</summary>

```tsx
const panGesture = Gesture.Pan()
  .onChange((event) => {
    translation.x.value += event.changeX
    translation.y.value += event.changeY
  })
  .onEnd(() => {
    translation.x.value = withSpring(0, { overshootClamping: true })
    translation.y.value = withSpring(0, { overshootClamping: true })
  })
```

</details>
<br/>
<details>
<summary>
  <b>[3]</b> Apply this `panGesture` to the `Animated.Image` element.
</summary>

Wrap the `content` with `<GestureDetector />` and apply the `panGesture` that you’ve just created `<GestureDetector gesture={panGesture}/>`

```tsx
<GestureDetector gesture={panGesture}>
  <View style={[styles.content]}>
    <Animated.Image
      source={{ uri: activeItem.originalUri }}
      style={styles.image}
      sharedTransitionTag={'image-' + activeItem.id}
    />
  </View>
  // other content
</GestureDetector>
```

</details>

<br/>
<b>[4]</b> Apply the movement based on the translation (`x` and `y`) to the content element, create a derived value `distance` (can be the absolute value of `x` and `y`) and interpolate this value for the `scale` style animation. <br/>

⚠️ Hint: Make `distance` a derived value <br/>
⚠️ Hint2: There's an `_overdrag` constant defined, use it for `distance` interpolation
<br/>

<details>
<summary>
  <b>[Solution]</b>
</summary>
<br/>
- create the `animatedStyle` using `useAnimatedStyle` and return change `translateX` and `translateY` with the modified shared values from `panGesture`.

```
const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translation.x.value },
      { translateY: translation.y.value },
    ],
  }))
```

- define a `distance` to allow to change other styles based on it. The `distance` should be the sum of `translation.x` and `translation.y` values.

```tsx
const distance = useDerivedValue(() => {
  return Math.abs(translation.x.value) + Math.abs(translation.y.value)
})
```

- apply a scale here as well, using `interpolate` (we want to change the scale from 1 → 0.5 based on the `_overDrag` ) and the `distance` that you’ve created.

```
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
```

</details>
<br/>

## Step 3 - The backdrop element and `GO BACK` action

https://user-images.githubusercontent.com/2805320/236148123-4974ff3c-4a44-43a4-8798-3e8154cb6081.mp4

Since we have the derived `distance` value, we can use it to animate the `backdrop` component. Also, when the `distance` is greater than the `_overdrag` we will go back using the `navigation.goBack()`.

<br/>

<details>
<summary>
  <b>[1]</b> create `backdropStyle` and apply it to the backdrop `View` element. You can interpolate `distance.value` with input range from `[0, _overdrag]` and output range `[1, 0]`
</summary>

```jsx
const backdropStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
    distance.value,
    [0, _overdrag],
    [1, 0],
    Extrapolate.CLAMP,
  ),
}))
```

</details>
<br/>
<details>
<summary>
  <b>[2]</b> We need to go back, so, when gesture end, check if the `distance.value` is greater than `_overDrag` and call `navigation.goBack` otherwise, snap back to position `x` and `y` to `0`.

  <br />
  ⚠️ Hint: Use `runOnJS` to call `goBack`, this is because the gesture is running on `UI thread`
  <br/>
</summary>

```jsx
.onEnd(() => {
  if (distance.value > _overdrag) {
    runOnJS(goBack)()
  } else {
    translation.x.value = withSpring(0, { overshootClamping: true })
    translation.y.value = withSpring(0, { overshootClamping: true })
  }
})
```

</details>
<br/>

## Step 4 (final)

https://user-images.githubusercontent.com/2805320/236148130-0c679a8c-2ded-4fad-ba6f-945014a4332c.mp4

In order to fully re-create the Airbnb style, we need to make the initial screen always visible and when we use gestures to drag the item from the `Details` screen, so when the `backdrop` opacity goes all the way to `0` we should see the `List`.

To do so, we can use the `transparentModal` appearance of the routing. We need to change the `options` of the `Details` screen inside the `Stack.Screen` to have `presentation: 'transparentModal'` and `animation: fade`

<details>
<summary>
  SOLUTION
</summary>

```jsx
<Stack.Screen
  name="SharedElementTransitionDndDetail"
  options={{
    animation: 'fade',
    presentation: 'transparentModal',
  }}
  component={SharedElementTransitionDndDetail}
/>
```

</details>
<br/>
## Next step

**Go to: [Arc](../Arc/)**
