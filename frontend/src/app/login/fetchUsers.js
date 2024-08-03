export default async function fetchUsers(email, password) {
  const res = await fetch(`${process.env.API_ENDPOINT}/allusers`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const users = await res.json();
  const user = users.find((u) => u.mail === email && u.password === password);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return user;
}
