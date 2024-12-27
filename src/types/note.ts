export type List = Item[]

export interface Item {
  id: string
  title: string
  todos: Todo[]
}

export interface Todo {
  id: string
  text: string
  isDone: boolean
}
