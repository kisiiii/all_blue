export default async function registerDog(userData) {
  const res = await fetch(`${process.env.API_ENDPOINT}/dogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to register user");
  }

  return await res.json();
}