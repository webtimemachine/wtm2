export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error.toUpperCase()
  } else if (error instanceof Error) {
    return error.message
  }

  return 'Error'
}