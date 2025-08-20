// api-gateway/src/routes/orderProxy.ts
import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { authenticateToken } from '../middleware/authMiddleware';

dotenv.config();

const router = Router();
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:5004';

const proxyRequest = async (serviceUrl: string, req: Request, res: Response) => {
  try {
    const fullTargetUrl = `${serviceUrl}${req.originalUrl}`;
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

router.post('/', authenticateToken, (req: Request, res: Response) => proxyRequest(ORDER_SERVICE_URL, req, res));
router.get('/:id', authenticateToken, (req: Request, res: Response) => proxyRequest(ORDER_SERVICE_URL, req, res));

export default router;