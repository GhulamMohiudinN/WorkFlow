"use client";
export async function tryCatch(promise) {
  try {
    const { data } = await promise; // axios response object
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
}