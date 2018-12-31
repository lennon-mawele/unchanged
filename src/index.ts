// external dependencies
import { __, curry } from 'curriable';

// handlers
import {
  createAdd,
  createAssign,
  createCall,
  createGet,
  createHas,
  createIs,
  createMerge,
  createRemove,
  createSet,
} from './handlers';

export { __ };

export const add: Function = curry(createAdd(false), 3);

export const addWith: Function = curry(createAdd(true), 3);

export const assign: Function = curry(createAssign(false), 3);

export const assignWith: Function = curry(createAssign(true), 4);

export const call: Function = curry(createCall(false), 3);

export const callWith: Function = curry(createCall(true), 4);

export const get: Function = curry(createGet(false, false), 2);

export const getOr: Function = curry(createGet(false, true), 3);

export const getWith: Function = curry(createSet(true, false), 3);

export const getWithOr: Function = curry(createSet(true, true), 4);

export const has: Function = curry(createHas(false), 2);

export const hasWith: Function = curry(createHas(true), 3);

export const is: Function = curry(createIs(false), 3);

export const isWith: Function = curry(createIs(true), 4);

export const merge: Function = curry(createMerge(false), 3);

export const mergeWith: Function = curry(createMerge(true), 4);

export const remove: Function = curry(createRemove(false), 2);

export const removeWith: Function = curry(createRemove(true), 3);

export const set: Function = curry(createSet(false), 3);

export const setWith: Function = curry(createSet(true), 3);