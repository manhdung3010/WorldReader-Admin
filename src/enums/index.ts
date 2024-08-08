export function getEnumKeyByValue(enumValue: any, value: any) {
  return Object.keys(enumValue).find(key => enumValue[key] === value) || ''
}

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other'
}

export enum Role {
  user = 'user',
  admin = 'admin'
}
