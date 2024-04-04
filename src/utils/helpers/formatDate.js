const formatDate = (date) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

export default formatDate;
