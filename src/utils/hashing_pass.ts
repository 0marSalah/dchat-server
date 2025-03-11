import bcrypt from 'bcrypt';

export const hashingPassword = async (password: string): Promise<string> => {
  return bcrypt.hashSync(password, +(process.env.HASH_SECRET as string));
};

export const isPassword = async (
  password: string | undefined,
  hashedPassword: string | undefined | null,
): Promise<boolean> => {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compareSync(password, hashedPassword);
};
