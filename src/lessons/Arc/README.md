# Animated Reactions

In this lesson we will create a arc motion effect.
We will explore [@Shopify/react-native-skia](https://github.com/Shopify/react-native-skia) integration with Reanimated 3, custom animation API, layout animations and shared transitions.

## Step 1 – Arc geometry (drawing)

In this step we focus on implementing a logic that calculates an arc between two points.
To visualize our algorithm, we use [@Shopify/react-native-skia](https://github.com/Shopify/react-native-skia) library to visualize it.
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

The complete implementation of `calculateArc` method should look as follows:

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

## Next step

**Congratulate yourself, you completed the final lesson 👏👏👏👏**
