exports.currentDateShort = (fromDate) => {
  const currentDate = fromDate ? new Date(fromDate) : new Date()
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return currentDate.toLocaleDateString('en-us', options)
}
