import { notification } from "antd";

export interface IValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface IHTTPValidationError {
  detail?: string | IValidationError[];
}

/**
 * Hàm để phân tích lỗi và trả về thông báo lỗi phù hợp.
 *
 * @param errDetail - Chi tiết của lỗi cần phân tích.
 * @returns Chuỗi thông báo lỗi.
 */
export const parseError = (errDetail: IValidationError): string => {
  let errMsg = "";
  if (Array.isArray(errDetail?.loc)) {
    if (errDetail.loc[0] === "path") return (errMsg = errDetail.msg);
    if (errDetail.loc[0] === "query") return (errMsg = errDetail.msg);

    if (errDetail.loc[0] === "body") {
      const invalidField: string = errDetail.loc[1];
      if (errDetail?.msg) {
        errMsg += `Invalid ${invalidField}`;
      }
    }
  } else {
    errMsg = "Something unknown went wrong.\n";
  }

  return errMsg;
};

/**
 * Hàm để xử lý lỗi và trả về danh sách thông báo lỗi.
 *
 * @param error - Lỗi HTTP chứa chi tiết các lỗi.
 * @returns Mảng các thông báo lỗi.
 */
export const handleError = (error: IHTTPValidationError): string[] => {
  const msg: string[] = [];

  if (typeof error?.detail === "string") {
    msg.push(error.detail);
  }

  if (Array.isArray(error?.detail)) {
    error.detail.forEach((errDetail) => {
      const errMsg = parseError(errDetail);
      msg.push(errMsg);
    });
  }

  return msg;
};

/**
 * Hàm hiển thị thông báo lỗi bằng notification của Ant Design.
 *
 * @param error - Lỗi HTTP chứa chi tiết lỗi.
 */
export const handleShowErr = (error: IHTTPValidationError) => {
  if (typeof error?.detail === "string") {
    notification.error({
      message: "Error",
      description: error.detail,
    });
  }
  if (Array.isArray(error?.detail)) {
    error.detail.forEach((errDetail) => {
      const errMsg = parseError(errDetail);
      notification.error({
        message: "Validation Error",
        description: errMsg,
      });
    });
  }
};

/**
 * Hàm xử lý lỗi trong khối try-catch và hiển thị thông báo lỗi thông qua notification.
 *
 * @param error - Đối tượng lỗi từ catch.
 */
export const handleTryCatchError = (error: unknown): void => {
  if (
    typeof error === "object" &&
    error !== null &&
    "detail" in (error as IHTTPValidationError)
  ) {
    handleShowErr(error as IHTTPValidationError);
  } else {
    notification.error({
      message: "Unexpected Error",
      description: "An unexpected error occurred. Please try again later.",
    });
  }
};
