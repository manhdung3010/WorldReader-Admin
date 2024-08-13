import { Gender, Role, UserStatus } from '.'

export interface UserType {
  id: number
  username: string
  fullName: string
  avatar: string
  email: string
  date: Date
  status: UserStatus
  gender: Gender
  role: Role
  createAt: Date
}
