import { hash, genSalt, compare } from 'bcryptjs'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(11)
  return await hash(password, salt)
}

export const comparePasswords = async (
  password: string,
  comparePass: string
): Promise<boolean> => {
  return await compare(password, comparePass)
}
