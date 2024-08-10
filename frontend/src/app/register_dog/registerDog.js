export default async function registerDog(formData) {
  try {
    console.log("Sending request with data:", formData);

    const res = await fetch(`${process.env.API_ENDPOINT}/dogs`, {
      method: "POST",
      body: formData, // FormDataオブジェクトを直接送信
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
