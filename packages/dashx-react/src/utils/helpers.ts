export function removeDataAttributes<T>(props: T): T {
  const prefix = /^(data-.*)$/;
  let filteredProps = {} as T;

  for (const prop in props) {
    if (!prefix.test(prop)) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}

export const fallbackEventTo = (props: any, eventName: string, fallbackEventName: string) => {
  const event = props[eventName];
  if (fallbackEventName in props && !event) {
    return [props[fallbackEventName], undefined];
  }

  return [event, props[fallbackEventName]];
};
