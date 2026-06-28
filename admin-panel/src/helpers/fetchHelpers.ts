export const handleResponse = async (res: Response) => {
  if (!res.ok) {

    const errorData = await res.json().catch(() => ({
      error: 'api.error.unknown',
      message: 'An unexpected error occurred'
    }));

    // Zod Errors are returned as JSON
    if (errorData?.success === false && errorData?.error?.message) {
      try {
        const issues = JSON.parse(errorData.error.message);

        if (Array.isArray(issues) && issues[0]?.message) {
          throw {
            error: issues[0].message,
            message: 'Validation Error'
          };
        }
      } catch {
        throw errorData;
      }
    }

    // If the error is not a Zod error, throw the original error comming from the API
    throw errorData;
  }

  return res.json();
};
