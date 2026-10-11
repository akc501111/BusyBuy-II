import { toast } from "react-toastify";

export const authGuardMiddleware = (store) => (next) => (action) => {
  const user = store.getState().auth.user;

  if (action.meta?.requiresAuth && !user) {
    toast.error("Please login first");
    return;
  }

  return next(action);
};

export const toastMiddleware = () => (next) => (action) => {
  // success
  if (action.type.endsWith("/fulfilled")) {
    const msg = action.meta?.arg?.meta?.successMessage;
    if (msg) toast.success(msg);
  }

  // failure
  if (action.type.endsWith("/rejected")) {
    const msg =
      action.meta?.arg?.meta?.errorMessage ||
      action.payload ||
      action.error?.message ||
      "Something went wrong";

    toast.error(msg);
  }

  return next(action);
};
