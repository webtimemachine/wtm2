import * as bcrypt from 'bcryptjs';
import { appEnv } from '../../config';

function hashValue(value: string): string {
  const saltRounds = Number(appEnv.BCRYPT_SALT);
  const hashedValue = bcrypt.hashSync(value, saltRounds);
  return hashedValue;
}

function compareHash(plainValue: string, hashedValue: string): boolean {
  return bcrypt.compareSync(plainValue, hashedValue);
}

export { hashValue, compareHash };
