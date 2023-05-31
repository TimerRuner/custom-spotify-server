export const filterDto = (data: object, privateFields: Array<string>) => {
  const result = {}
  for(const key in data) {
    if(data.hasOwnProperty(key) && !privateFields.includes(key)) {
      result[key] = data[key]
    }
  }
  return result
}