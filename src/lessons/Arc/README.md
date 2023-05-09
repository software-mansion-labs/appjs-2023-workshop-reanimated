# Animated Reactions

In this lesson we will create a arc motion effect.
We will explore [@Shopify/react-native-skia](https://github.com/Shopify/react-native-skia) integration with Reanimated 3, custom animation API, layout animations and shared transitions.

## Step 1 – Arc geometry (drawing)

In this step we focus on implementing a logic that calculates an arc between two points.
To visualize our algorithm, we use [@Shopify/react-native-skia](https://github.com/Shopify/react-native-skia) library to draw the calculated arc.
The [Arc.tsx](./Arc.tsx) template defines a component that creates a [Skia canvas](https://shopify.github.io/react-native-skia/docs/canvas/overview), and uses [`Path`](https://shopify.github.io/react-native-skia/docs/shapes/path) component to draw a path between a predefined start and end points.
In this step we will fill the missing implementation of the `calculateArc` method.

Below we explain the math behind calculating the arc. We first consider the case when starting point (S) and final point (T) are located such that the horizontal movement is greater than vertical movement, and also that we are going downwards.

In this technique we wan't to locate the position of point B, and then draw a cubic bezier that starts and ends in S and T respecively and uses midpoints between S and B, and B and T as control points:

<img height="600" alt="image" src="https://user-images.githubusercontent.com/726445/236708795-76e84b1c-a83b-43d2-b3a1-102997d372a1.png">

We now add helper point A positioned vertically with S and horizontally with T, and helper point C which is a midpoint between S and T.

<img src="https://user-images.githubusercontent.com/726445/236708566-ef1a1eab-ff35-4681-9fc0-93a0bff6d775.png" height=600/>

We note that triangles SAT and CBT are similar because they have identical angles, this allows us to derive a formula for the distance between B and T points:

${\Large\frac{|BT|}{|CT|}} = {\Large\frac{|ST|}{|AT|}}$

We further get that:
$|BT| = {\Large\frac{|ST|^2}{2|AT|}}$

In addition we know that the distance $|ST|^2$ is expressed as: $|ST|^2 = (x_T - x_S)^2 + (y_T - y_S)^2$ where $(x_T, y_T)$ and $(x_S, y_S)$ are coordinates of points T and S respetively. And that $|AT|$ is expressed as $|AT| = \|y_T - y_A\|$ since x-coordinates of points A and T are the same.

Finally, we find cubic bezier control points as midpoint between S and B, and B and T. This can be done averaging x and y coordinates of the points in question, e.g.:

$x_{Q_1} = x_S + x_B) / 2$

$y_{Q_1} = y_S + y_B) / 2$

where $Q_1 = (x_{Q_1}, y_{Q_1})$ is the control point located between $S = (x_S, y_S)$ and $B = (x_B, y_B)$.

### Tasks

<details>
<summary><b>[1]</b> In <a href="./Arc.tsx">Arc.tsx</a> template, implement <code>calculateArc</code> for the case of greater horizontal distance using the provided formula.
</summary>

First calculate vertical, horizontal and distance squared:

```js
const dx = endPt.x - startPt.x
const dy = endPt.y - startPt.y
const dist2 = dx * dx + dy * dy
```

We now implement the above formula to calculate the B point coordinates:

```js
const AT = Math.abs(dy)
const B = {
  x: endPt.x,
  y: endPt.y - dist2 / 2 / AT,
}
```

Finally, we calculate control points $Q_1$ and $Q_2$ as midpoints between S and B, and B and T:

```js
const q1 = { x: (startPt.x + B.x) / 2, y: (startPt.y + B.y) / 2 }
const q2 = { x: (endPt.x + B.x) / 2, y: (endPt.y + B.y) / 2 }
```

The complete implementation of `calculateArc` method may look as follows:

```js
function calculateArc(startPt, endPt) {
  const path = Skia.Path.Make()
  path.moveTo(startPt.x, startPt.y)

  const dx = endPt.x - startPt.x
  const dy = endPt.y - startPt.y

  const dist2 = dx * dx + dy * dy

  const AT = Math.abs(dy)
  const B = {
    x: endPt.x,
    y: endPt.y - dist2 / 2 / AT,
  }

  const q1 = { x: (startPt.x + B.x) / 2, y: (startPt.y + B.y) / 2 }
  const q2 = { x: (endPt.x + B.x) / 2, y: (endPt.y + B.y) / 2 }

  path.cubicTo(q1.x, q1.y, q2.x, q2.y, endPt.x, endPt.y)

  return path
}
```

</details><br/>

<details>
<summary><b>[2]</b> Cover the remaining cases: when vertical distance if greater, and when both points are located on vertical or horizontal line.
</summary>

We will start by initializing B to be a midpoint between S and T:

```js
const B = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }
```

Now we need to detect a few cases, let's start from the case we already covered when horizontal distance is higher. We should also consider the case of upward or downward movement. It turns out it is sufficient to not use `Math.abs` when calculating the distance, this case when subtracting from `endPt.y` we will always turn in the correct direction:

```js
if (Math.abs(dx) < Math.abs(dy)) {
  B.x = endPt.x
  B.y = endPt.y - dist2 / 2 / dy
}
```

Similarily, we cover the opposite case with more vertical than horizontal movement, we do it in the `else` clause:

```js
else {
  B.x = endPt.x - dist2 / 2 / dx;
  B.y = endPt.y;
}
```

Finally, we need to treat only vertical/horizontal movement as a special case. Otherwise, we will just get a straight line. In these two cases we take midpoint as one of the coordinates, and for the second coordinate of point B, we add some constant offset:

```js
const MIN_BOUND_DIST = 30
```

We detect vertical/horizontal lines by checking whether it falls below some threshold. Similarily, we want the curve to be convex in different direction depending on whether it goes upwards or downwards, therefore we either offset by negative or positive distance.

```js
if (Math.abs(dx) < 0.5) {
  B.x += endPt.x < startPt.x ? MIN_BOUND_DIST : -MIN_BOUND_DIST
} else if (Math.abs(dy) < 0.5) {
  B.y += endPt.y < startPt.y ? MIN_BOUND_DIST : -MIN_BOUND_DIST
}
```

Here is the current version of `calculateArc` in full:

```js
const MIN_BOUND_DIST = 30

function calculateArc(startPt, endPt) {
  const path = Skia.Path.Make()
  path.moveTo(startPt.x, startPt.y)

  const dx = endPt.x - startPt.x
  const dy = endPt.y - startPt.y

  const dist2 = dx * dx + dy * dy

  if (dist2 < 0.5) {
    path.moveTo(endPt.x, endPt.y)
    return path
  }

  const B = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }

  if (Math.abs(dx) < Math.abs(dy)) {
    B.x = endPt.x
    B.y = endPt.y - dist2 / 2 / dy
  } else {
    B.x = endPt.x - dist2 / 2 / dx
    B.y = endPt.y
  }

  if (Math.abs(dx) < 0.5) {
    B.x += endPt.x < startPt.x ? MIN_BOUND_DIST : -MIN_BOUND_DIST
  } else if (Math.abs(dy) < 0.5) {
    B.y += endPt.y < startPt.y ? MIN_BOUND_DIST : -MIN_BOUND_DIST
  }

  const q1 = { x: (startPt.x + B.x) / 2, y: (startPt.y + B.y) / 2 }
  const q2 = { x: (endPt.x + B.x) / 2, y: (endPt.y + B.y) / 2 }

  path.cubicTo(q1.x, q1.y, q2.x, q2.y, endPt.x, endPt.y)

  return path
}
```

</details>

<details>
<summary><b>[3]</b> Verify that the arc look ok for all possible settings (more horizontal/more vertical, downward/upward, vertical/horizontal line).
</summary>

Here are some test examples you may want to verity:

1. Greater horizontal movement going downward

```js
const start = { x: 330, y: 30 }
const end = { x: 150, y: 400 }
```

2. Same but upwards

```js
const start = { x: 150, y: 400 }
const end = { x: 330, y: 30 }
```

3. Greater vertical movement going downward

```js
const start = { x: 100, y: 140 }
const end = { x: 250, y: 170 }
```

4. Same but upwards

```js
const start = { x: 250, y: 170 }
const end = { x: 100, y: 140 }
```

5. Vertical line downwards

```js
const start = { x: 100, y: 170 }
const end = { x: 100, y: 340 }
```

6. Vertical line upwards

```js
const start = { x: 100, y: 320 }
const end = { x: 100, y: 120 }
```

6. Horizontal line (left to right)

```js
const start = { x: 30, y: 200 }
const end = { x: 230, y: 200 }
```

6. Horizontal line (right to left)

```js
const start = { x: 260, y: 180 }
const end = { x: 110, y: 180 }
```

</details>

<details>
<summary><b>[BONUS 1]</b> Add minimum convexity for the curve in cases when point B is near the line between S and T (this will result in an almost flat curve)
</summary>

In this step we want the B point to be at a certain distance from the line joining points S and T.
We first need to detect if point B is too close.
If it is, we "extend" the vector joining modpoint C with B such that it starts in C but has a length of at least some specified constant.

We start by testing whether B is near the line between S and T. We can do this by measuring the distance between C and B, as point C is the nearest point to B on the ST line:

```js
const midPt = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }
const BDist2 =
  (B.x - midPt.x) * (B.x - midPt.x) + (B.y - midPt.y) * (B.y - midPt.y)

if (BDist2 < MIN_BOUND_DIST * MIN_BOUND_DIST) {
  // make AB vector length to be at least MIN_BOUND_DIST
}
```

Now, we move B coords such that CB vector points towords the same direction but its length is MIN_BOUND_DIST.
This can be done by measuring the ratio between the current length and the target legth, and then by multiplying the end
coordinates by the calculated ratio:

```js
if (BDist2 < MIN_BOUND_DIST * MIN_BOUND_DIST) {
  // make AB vector length to be at least MIN_BOUND_DIST
  const ratio = MIN_BOUND_DIST / Math.sqrt(BDist2)
  B.x = midPt.x + (B.x - midPt.x) * ratio
  B.y = midPt.y + (B.y - midPt.y) * ratio
}
```

Check [steps/step1.tsx](steps/step1.tsx) for the final implementation of the `calculateArc` method.

</details>

## Step 2 – Animating Skia with Reanimated

In this step we will use Reanimated to animate a portion of the path.
This excercise will let us explore Reanimated and Skia integration that Reanimated 3 unlocked.

![arc animation](https://user-images.githubusercontent.com/726445/236938255-78d92ea5-b95c-4b69-87b0-b0173c48e0d6.gif)

### Tasks

<details>
<summary><b>[1]</b> Create shared value representing animation progress that starts animating between 0 and 1 on component mount.
</summary>

First, define a shared value initialized to 0 in your component code:

```js
const progress = useSharedValue(0)
```

Now, use `useEffect` hook to initialized an animation on component mount.
We will use `withTiming` composed with `withRepeat` to get a back and forth animation between 0 and 1:

```js
useEffect(() => {
  progress.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true)
}, [])
```

</details>

<details>
<summary><b>[2]</b> Use <code>useDerivedValue</code> that returns a path cropped according to progress value. Use Path’s <a href="https://github.com/Shopify/react-native-skia/blob/main/package/src/skia/types/Path/Path.ts#L357"><code>copy</code></a> and <a href="https://github.com/Shopify/react-native-skia/blob/main/package/src/skia/types/Path/Path.ts#L538"><code>trim</code></a> methods.
</summary>

We use `useDerivedValue` hook from Reanimated in order provide a shared value that represets a arc trimmed to the progress.

Since [`trim`](https://github.com/Shopify/react-native-skia/blob/main/package/src/skia/types/Path/Path.ts#L538) method mutates the Path object, we need to clone it first. Also, watch out as `trim` does not accept value `1` as the end number:

```js
const partOfArc = useDerivedValue(() => {
  return progress.value < 1 ? arc.copy().trim(0, progress.value, false) : arc
})
```

</details>

<details>
<summary><b>[3]</b> Pass derived value to Path component as a prop.
</summary>

Skia integrates with Reanimated and accepts shared values as its component properties.
When used this way, all updates that happen to the shared value (including animations) are happening on the UI thread:

```jsx
<Path
  color={colorShades.purple.base}
  style="stroke"
  strokeWidth={5}
  path={partOfArc}
/>
```

</details>

## Step 3 – Custom animation along an arc

In this step we will implement a custom animation using `defineAnimation` API from Reanimated in order to achieve an effect of animating objects along an arc.

![animate view along arc](https://user-images.githubusercontent.com/726445/236950413-bf90e410-79a8-4594-a4e8-f0252220535f.gif)

We will write our own `withArcAnimation` method that takes a point and timing function and returns a point with separate animations for `x` and `y` coordinates. Each animation will be created using `defineAnimation` helper from Reanimated and will communicate with shared animation data that controlls the progress of moving along a path. For this purpose we will use the following schema:

```js
export function withArcAnimation(pt, progressAnimation) {
  'worklet'
  const arcAnimationData = {
    // here you can keep some data shared between animations of individual coordinates
  }

  return {
    x: defineAnimation(pt.x, () => {
      'worklet'
      return {
        onStart: (_, value, now) => {
          // remember starting value for X coordinate in shared arcAnimationData
        },
        onFrame: (animation, now) => {
          // use shared arcAnimationData to step path animation and read X coordinate into animation.current
        },
      }
    }),
    y: defineAnimation(pt.y, () => {
      'worklet'
      return {
        onStart: (_, value, now) => {
          // remember starting value for Y coordinate in shared arcAnimationData
        },
        onFrame: (animation, now) => {
          // use shared arcAnimationData to step path animation and read X coordinate into animation.current
        },
      }
    }),
  }
}
```

Later on, we will be able to use `withArcAnimation` in `useAnimatedStyle` as follows in order to control `left` and `top` position of a view:

```js
const style = useAnimatedStyle(() => {
  // we pass the target point coordinates and timing function to be used to navigate the view along the arc
  const animatedPt = withArcAnimation(pt, withTiming(1))
  return {
    left: animatedPt.x,
    top: animnatedPt.y,
  }
})
```

<details>
<summary><b>[1]</b> Create an absolutely positioned view that uses `withArcAnimation` to control <code>top</code> and <code>left</code> style attributes. Add a button that updates component state with a random target position for the view.
</summary>
</details>

<summary><b>[2]</b> Implement <code>onStart</code> – remember the starting value provided to the callbacks in order
</summary>
</details>

## Step 4 – Custom layout animation

![custom layout animation](https://user-images.githubusercontent.com/726445/236950413-bf90e410-79a8-4594-a4e8-f0252220535f.gif)

## Step 5 – Custom shared transition

![custom shared transition](https://user-images.githubusercontent.com/726445/236952511-6d7944ef-11bc-4cee-9fe8-235f55b4864e.gif)

## Next step

**Congratulate yourself, you completed the final lesson 👏👏👏👏**
