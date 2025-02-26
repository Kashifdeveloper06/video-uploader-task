export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};
