import { format } from "date-fns";

export default function formatDateTime(date: Date) {
  return format(date, "dd/MM/yyyy HH:mm:ss");
}
