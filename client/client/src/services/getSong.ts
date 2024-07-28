export const getSong = async (url: string) => {
  const response = await fetch(`http://localhost:8080/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  return response;
};
