import toast from 'react-hot-toast';
import i18n from 'i18next';  // імпорт i18n екземпляру

export const errorMiddleware = store => next => action => {
  if (action.type.endsWith("/rejected") && action.payload) {
    const error = action.payload;

    let message = i18n.t("common.toast.unknown");

    if (typeof error === "string") {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.error) {
      message = error.error;
    } else if (error?.status === 401) {
      message = i18n.t("common.toast.unauthorized");
    } else if (error?.status === 403) {
      message = i18n.t("common.toast.forbidden");
    } else if (error?.status === 404) {
      message = i18n.t("common.toast.notFound");
    } else if (error?.status === 500) {
      message = i18n.t("common.toast.serverError");
    } else if (error?.data?.message) {
      message = error.data.message;
    }

    console.warn("API error:", error);
    toast.error(message);
  }

  return next(action);
};
