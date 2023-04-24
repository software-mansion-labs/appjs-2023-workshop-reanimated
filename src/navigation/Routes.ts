type LessonRoutes = {
  CircleGesturesLesson: undefined
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
]
export type Routes = LessonRoutes & { Home: undefined }
