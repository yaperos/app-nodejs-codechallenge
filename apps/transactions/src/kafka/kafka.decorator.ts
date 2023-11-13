export const SUBSCRIBER_FN_REF_MAP = new Map();
export const SUBSCRIBER_FIXED_FN_REF_MAP = new Map();
export const SUBSCRIBER_OBJ_REF_MAP = new Map();

export function SubscribeTo(topic) {
  return (target, propertyKey, descriptor?) => {
    const originalMethod = descriptor.value;
    SUBSCRIBER_FN_REF_MAP.set(topic, originalMethod);
    SUBSCRIBER_OBJ_REF_MAP.set(topic, target);
    descriptor.value = function (...args) {
      originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

export const SubscribeToFixedGroup = (topic) => {
  return (target, propertyKey, descriptor) => {
    const originalMethod = target[propertyKey];
    SUBSCRIBER_FIXED_FN_REF_MAP.set(topic, originalMethod);
    SUBSCRIBER_OBJ_REF_MAP.set(topic, target);
    return descriptor;
  };
};
