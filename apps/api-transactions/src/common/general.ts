const validateObject = (objectValidate: any) => {
    if (
        objectValidate !== undefined &&
        objectValidate !== null) {
        return true
    }
    return false
  }
  
  export { validateObject }