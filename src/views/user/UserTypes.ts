import { UserStatus } from "src/enums"

export interface FormFilter {
    username: string;
    email: string;
    gender: string;
    role: string;
    status: UserStatus;
    page: number;
    pageSize: number;
  }
  
  export interface UserFiltersProps {
    formFilter: FormFilter;
    setFormFilter: React.Dispatch<React.SetStateAction<FormFilter>>;
  }