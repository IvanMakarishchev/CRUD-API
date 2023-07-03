import { Data } from '../interfaces/data';

export const isData = (obj: any): obj is Data => {
  return (
    'username' in obj &&
    'age' in obj &&
    'hobbies' in obj &&
    typeof obj.username === 'string' &&
    typeof obj.age === 'number' &&
    obj.hobbies instanceof Array &&
    !(obj.hobbies as []).some((el) => typeof el !== 'string')
  );
};
