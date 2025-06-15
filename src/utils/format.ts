import dayjs from "dayjs";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(amount)
    .replace("₫", "VND");
};
export const formatDate = (date: Date): string => {
  return dayjs(date).format("DD/MM/YYYY");
};
