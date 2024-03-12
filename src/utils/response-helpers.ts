export function success(message: string, obj: any = {}) {
  obj.success = true
  obj.message = message
  return obj
}

export function fail(message: string, obj: any = {}) {
  obj.success = false
  obj.message = message
  return obj
}
