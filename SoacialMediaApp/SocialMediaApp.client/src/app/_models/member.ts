import {Photo} from "./photo";

export interface Member {
  username: string
  knownAs: string
  created: Date
  lastActive: Date
  gender: string
  introduction: string
  interests: string
  lookingFor: string
  city: string
  country: string
  photos: Photo[]
  age: number
  photoUrl: string
}

