import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'; 

dotenv.config();

const router = Router();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:5000';

// Hàm helper để proxy request
const proxyRequest = async (serviceUrl: string, req: Request, res: Response, pathRewriteRegex?: RegExp, replaceString?: string) => {
  try {
    let targetPath = req.originalUrl;

    if (pathRewriteRegex && replaceString) {
      targetPath = targetPath.replace(pathRewriteRegex, replaceString);
    }
    
    const fullTargetUrl = `${serviceUrl}${targetPath}`;
    console.log(`[API Gateway] Proxying ${req.method} request to: ${fullTargetUrl}`);

    const headers = { ...req.headers };
    delete headers.host; 

    // Thiết lập cấu hình Axios request
    const axiosConfig: AxiosRequestConfig = {
      method: req.method as AxiosRequestConfig['method'], 
      url: fullTargetUrl,
      headers: headers,
      data: req.body, 
      params: req.query, 
      validateStatus: () => true,
      responseType: 'arraybuffer',
    };

    const serviceResponse: AxiosResponse = await axios(axiosConfig);

    for (const key in serviceResponse.headers) {
      if (serviceResponse.headers.hasOwnProperty(key)) {
        res.setHeader(key, serviceResponse.headers[key] as string);
      }
    }

    // Đặt status code của response từ service
    res.status(serviceResponse.status);

    // Gửi dữ liệu response từ service
    res.send(serviceResponse.data);

  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[API Gateway] Proxy Error for ${serviceUrl}:`, axiosError.message);

    // Xử lý lỗi kết nối cụ thể
    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
      res.status(503).json({ message: `${serviceUrl} service is currently unavailable.` });
    } else {
      res.status(500).json({ message: `Internal server error during proxy to ${serviceUrl}.` });
    }
  }
};

router.post('/register', (req: Request, res: Response) => {
  proxyRequest(AUTH_SERVICE_URL, req, res);
});

router.post('/login', (req: Request, res: Response) => {
  proxyRequest(AUTH_SERVICE_URL, req, res);
});

router.post('/verify-token', (req: Request, res: Response) => {
    proxyRequest(AUTH_SERVICE_URL, req, res);
});


export default router;