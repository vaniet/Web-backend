export class ResponseResult<T = any> {
    code: number;
    message: string;
    data?: T;
    timestamp: number;
  
    private constructor(code: number, message: string, data?: T) {
      this.code = code;
      this.message = message;
      this.data = data;
      this.timestamp = Date.now();
    }
  
    static success<T = any>(data?: T, message = "操作成功"): ResponseResult<T> {
      return new ResponseResult(200, message, data);
    }
  
    static error<T = any>(message: string, code = 1, data?: T): ResponseResult<T> {
      return new ResponseResult(code, message, data);
    }
  }