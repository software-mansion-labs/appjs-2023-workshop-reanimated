type LessonRoutes = {
  CircleGesturesLesson: undefined
  BaloonSliderLesson: undefined
}
type RouteMeta = {
  name: keyof LessonRoutes
  title: string
  subtitle: string
}

export const routes: RouteMeta[] = [
  {
    name: 'CircleGesturesLesson',
    title: 'Circle Gestures 👉',
    subtitle: 'Lesson 1',
  },
  {
    name: 'BaloonSliderLesson',
    title: 'Baloon Slider 👉',
    subtitle: 'Lesson 2',
  },
]
export type Routes = LessonRoutes & { Home: undefined }
