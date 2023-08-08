export const getTimeDifferenceFromTimestamp = (timestamp) => {
  const now = new Date();
  const givenTimestamp = new Date(timestamp);
  const timeDifferenceMs = now - givenTimestamp;

  const hoursDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
  const minutesDifference = Math.floor(
    (timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  return { hours: hoursDifference, minutes: minutesDifference };
};
