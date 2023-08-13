import { randFullName, randEmail } from '@ngneat/falso';

export const createRandomUser = () => {
  const data = {
    email:  randEmail({provider:'jenseneducation', suffix:'se'}),
    name:   randFullName({gender:'female'}),
    gender: 'female',
    status: 'active'
  };
  return data;
}