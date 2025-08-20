import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware'; // Đảm bảo đường dẫn đúng

dotenv.config();

const router = Router();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:5001'; // URL của Product Service

// Hàm helper để proxy request (đã có, nhưng cần đảm bảo nó truyền headers X-User-...)
const proxyRequest = async (serviceUrl: string, req: Request, res: Response, pathRewriteRegex?: RegExp, replaceString?: string) => {
    try {
        let targetPath = req.originalUrl;
        targetPath = req.originalUrl; 

        if (pathRewriteRegex && replaceString) {
            targetPath = targetPath.replace(pathRewriteRegex, replaceString);
        }

        const fullTargetUrl = `${serviceUrl}${targetPath}`;
        console.log(`[API Gateway] Proxying ${req.method} request to: ${fullTargetUrl}`);

        const headers = { ...req.headers };
        delete headers.host; // Xóa header host để tránh lỗi proxy

        // THÊM THÔNG TIN NGƯỜI DÙNG TỪ req.user VÀO HEADERS CHO MICROSERVICE
        if (req.user) {
            headers['X-User-ID'] = req.user.id;
            headers['X-User-Role'] = req.user.role;
            if (req.user.email) {
                headers['X-User-Email'] = req.user.email;
            }
            // Nếu bạn có trường name trong user, cũng có thể thêm vào
            // if (req.user.name) { headers['X-User-Name'] = req.user.name; }
        }

        const axiosConfig: AxiosRequestConfig = {
            method: req.method as AxiosRequestConfig['method'],
            url: fullTargetUrl,
            headers: headers,
            data: req.body,
            params: req.query,
            validateStatus: () => true, // Quan trọng để Axios không ném lỗi cho các mã trạng thái HTTP không thành công
            responseType: 'arraybuffer', // Để xử lý mọi loại response data
        };

        const serviceResponse: AxiosResponse = await axios(axiosConfig);

        // Chuyển tiếp tất cả các headers từ service response về client
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

router.get('/', (req: Request, res: Response) => proxyRequest(PRODUCT_SERVICE_URL, req, res));
router.get('/:id', (req: Request, res: Response) => proxyRequest(PRODUCT_SERVICE_URL, req, res));

// Admin-only: POST, PUT, DELETE categories
router.post('/', authenticateToken, authorizeRoles(['admin']), (req: Request, res: Response) => proxyRequest(PRODUCT_SERVICE_URL, req, res));
router.put('/:id', authenticateToken, authorizeRoles(['admin']), (req: Request, res: Response) => proxyRequest(PRODUCT_SERVICE_URL, req, res));
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), (req: Request, res: Response) => proxyRequest(PRODUCT_SERVICE_URL, req, res));

export default router;