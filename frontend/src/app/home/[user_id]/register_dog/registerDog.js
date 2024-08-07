export default async function registerDog(userData) {
  try {
    console.log("Sending request with data:", userData);

    const res = await fetch(`${process.env.API_ENDPOINT}/dogs`, {
      method: "POST",
      body: userData, // FormDataオブジェクトを直接送信
    });

    if (!res.ok) {
      const errorData = await res.text(); // JSONではなくテキストとしてレスポンスを取得
      console.error("Error response from server:", errorData);
      throw new Error(errorData || "Failed to register dog");
    }

    return await res.json();
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
}
