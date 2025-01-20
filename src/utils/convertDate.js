export const convertDate = (timestamp) => {
  if (timestamp) {
    const d = new Date(timestamp * 1000);
    return (d.getMonth() + 1) + '/' + (d.getDate()) + '/' + d.getFullYear()
  }
  return null
}