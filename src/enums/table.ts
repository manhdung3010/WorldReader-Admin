import { UserType } from "./row"

export interface UserTableProps {
  rows: UserType[]
  isLoading: boolean
  isError: boolean
}
