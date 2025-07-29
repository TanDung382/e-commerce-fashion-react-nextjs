import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { authenticateToken } from '../middleware/authMiddleware'; 

dotenv.config();

const router = Router();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:5002';

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

    if (req.user) { 
        headers['X-User-ID'] = req.user.id;
        headers['X-User-Role'] = req.user.role;
        if (req.user.email) {
            headers['X-User-Email'] = req.user.email;
        }
    }

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
    res.status(serviceResponse.status);
    res.send(serviceResponse.data);

  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[API Gateway] Proxy Error for ${serviceUrl}:`, axiosError.message);

    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
      res.status(503).json({ message: `${serviceUrl} service is currently unavailable.` });
    } else {
      res.status(500).json({ message: `Internal server error during proxy to ${serviceUrl}.` });
    }
  }
};

router.get('/profile', authenticateToken, (req: Request, res: Response) => {
    proxyRequest(USER_SERVICE_URL, req, res);
});

// Route để cập nhật profile (cần xác thực)
router.put('/profile', authenticateToken, (req: Request, res: Response) => {
    proxyRequest(USER_SERVICE_URL, req, res);
});

router.get('/:userId', authenticateToken, (req: Request, res: Response) => {
    proxyRequest(USER_SERVICE_URL, req, res);
});
export default router;