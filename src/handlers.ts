// utils
import {
  callIfFunction,
  getDeepClone,
  getFullPath,
  getMergedObject,
  getNestedProperty,
  getNewEmptyObject,
  isCloneable,
  isEmptyPath,
  isSameValueZero,
  splice,
  throwInvalidFnError,
} from './utils';

const { isArray } = Array;
const { slice } = Array.prototype;

export const createCall: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      parameters: any[],
      object: unchanged.Unchangeable | Function,
      context: any = object,
    ): any {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 5);

      if (isEmptyPath(path)) {
        return callIfFunction(fn(object, ...extraArgs), context, parameters);
      }

      const value: any = getNestedProperty(path, object);

      if (value === void 0) {
        return;
      }

      const result: any = fn(value, ...extraArgs);

      return callIfFunction(result, context, parameters);
    };
  }

  return (
    path: unchanged.Path,
    parameters: any[],
    object: unchanged.Unchangeable | Function,
    context = object,
  ): any => {
    const callable: any = isEmptyPath(path)
      ? object
      : getNestedProperty(path, object);

    return callIfFunction(callable, context, parameters);
  };
};

export const createGet: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): any {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      if (isEmptyPath(path)) {
        return fn(object, ...extraArgs);
      }

      const value: any = getNestedProperty(path, object);

      return value === void 0 ? value : fn(value, ...extraArgs);
    };
  }

  return (path: unchanged.Path, object: unchanged.Unchangeable): any =>
    isEmptyPath(path) ? object : getNestedProperty(path, object);
};

export const createGetOr: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      noMatchValue: any,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): any {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      if (isEmptyPath(path)) {
        return fn(object, ...extraArgs);
      }

      const value: any = getNestedProperty(path, object);

      return value === void 0 ? noMatchValue : fn(value, ...extraArgs);
    };
  }

  return (
    noMatchValue: any,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): any =>
    isEmptyPath(path) ? object : getNestedProperty(path, object, noMatchValue);
};

export const createHas: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): boolean {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      if (isEmptyPath(path)) {
        return !!fn(object, ...extraArgs);
      }

      const value: any = getNestedProperty(path, object);

      return value !== void 0 && !!fn(value, ...extraArgs);
    };
  }

  return (path: unchanged.Path, object: unchanged.Unchangeable): boolean =>
    isEmptyPath(path)
      ? object != null
      : getNestedProperty(path, object) !== void 0;
};

export const createIs: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      value: any,
      object: unchanged.Unchangeable,
    ): boolean {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      if (isEmptyPath(path)) {
        return isSameValueZero(fn(object, ...extraArgs), value);
      }

      return isSameValueZero(
        fn(getNestedProperty(path, object), ...extraArgs),
        value,
      );
    };
  }

  return (
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): boolean =>
    isEmptyPath(path)
      ? isSameValueZero(object, value)
      : isSameValueZero(getNestedProperty(path, object), value);
};

export const createMerge: Function = (
  isWith: boolean,
  isDeep: boolean,
): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      if (!isCloneable(object)) {
        return fn(object, ...extraArgs);
      }

      if (isEmptyPath(path)) {
        const objectToMerge: any = fn(object, ...extraArgs);

        return objectToMerge
          ? getMergedObject(object, objectToMerge, isDeep)
          : object;
      }

      let hasChanged: boolean = false;

      const result: unchanged.Unchangeable = getDeepClone(
        path,
        object,
        (ref: unchanged.Unchangeable, key: string): void => {
          const objectToMerge: any = fn(ref[key], ...extraArgs);

          if (objectToMerge) {
            ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);

            hasChanged = true;
          }
        },
      );

      return hasChanged ? result : object;
    };
  }

  return (
    path: unchanged.Path,
    objectToMerge: unchanged.Unchangeable,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable => {
    if (!isCloneable(object)) {
      return objectToMerge;
    }

    return isEmptyPath(path)
      ? getMergedObject(object, objectToMerge, true)
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: string): void => {
            ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);
          },
        );
  };
};

export const createRemove: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      if (isEmptyPath(path)) {
        const emptyObject: unchanged.Unchangeable = getNewEmptyObject(object);

        return fn(emptyObject, ...extraArgs) ? emptyObject : object;
      }

      const value: any = getNestedProperty(path, object);

      return value !== void 0 && fn(value, ...extraArgs)
        ? getDeepClone(
            path,
            object,
            (ref: unchanged.Unchangeable, key: string): void => {
              if (isArray(ref)) {
                splice(ref, key);
              } else {
                delete ref[key];
              }
            },
          )
        : object;
    };
  }

  return (
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable => {
    if (isEmptyPath(path)) {
      return getNewEmptyObject(object);
    }

    return getNestedProperty(path, object) !== void 0
      ? getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: string): void => {
            if (isArray(ref)) {
              splice(ref, key);
            } else {
              delete ref[key];
            }
          },
        )
      : object;
  };
};

export const createSet: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      return isEmptyPath(path)
        ? fn(object, ...extraArgs)
        : getDeepClone(
            path,
            object,
            (ref: unchanged.Unchangeable, key: string): void => {
              ref[key] = fn(ref[key], ...extraArgs);
            },
          );
    };
  }

  return (
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable =>
    isEmptyPath(path)
      ? value
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: string): void => {
            ref[key] = value;
          },
        );
};

export const createAdd: Function = (isWith: boolean): Function => {
  const add: Function = createSet(isWith);

  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      return add.apply(
        this,
        [fn, getFullPath(path, object, fn), object].concat(
          slice.call(arguments, 3),
        ),
      );
    };
  }

  return (
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable => add(getFullPath(path, object), value, object);
};
