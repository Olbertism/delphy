export default function formatDate(isoString) {
  const date = new Date(isoString);

  return (
    date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
  );
}
