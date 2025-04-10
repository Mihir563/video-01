// types/index.ts

export interface Template {
  id: string
  title: string
  description: string
  thumbnail: string
  url:string
  bestFor: string
  tags: string[]
  effect: string
}

export interface UserImage {
  id: string
  url: string
  title: string
  index:number
}