// services/order-service/src/services/orderService.ts
import { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { Order, NewOrder, OrderItem, OrderAddress, PaymentInfo } from '../models/orderModel';

function binaryToUuid(buffer: Buffer): string {
  if (!buffer || buffer.length !== 16) {
    throw new Error('Invalid UUID buffer for conversion');
  }
  return buffer.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}

function uuidToBinary(uuid: string): Buffer {
  if (!uuid || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    throw new Error('Invalid UUID string for conversion');
  }
  const hex = uuid.replace(/-/g, '');
  return Buffer.from(hex, 'hex');
}

export class OrderService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private mapRowToOrder(row: RowDataPacket): Order {
    return {
      id: binaryToUuid(row.id),
      user_id: binaryToUuid(row.user_id),
      order_address_id: binaryToUuid(row.order_address_id),
      total_amount: parseFloat(row.total_amount),
      status: row.status as Order['status'],
      payment_method: row.payment_method as Order['payment_method'],
      note: row.note || null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  private mapRowToOrderItem(row: RowDataPacket): OrderItem {
    return {
      id: binaryToUuid(row.id),
      order_id: binaryToUuid(row.order_id),
      product_id: binaryToUuid(row.product_id),
      quantity: row.quantity,
      price: parseFloat(row.price),
      size_id: row.size_id || null,
      size_value: row.size_value || null,
      product_name: row.product_name || null,
      product_image: row.product_image || null,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  private mapRowToOrderAddress(row: RowDataPacket): OrderAddress {
    return {
      id: binaryToUuid(row.id),
      full_address_line: row.full_address_line,
      house_number: row.house_number || null,
      street_name: row.street_name || null,
      neighborhood: row.neighborhood || null,
      ward: row.ward || null,
      city: row.city || null,
      country: row.country || 'Vietnam',
      recipient_name: row.recipient_name,
      recipient_phone: row.recipient_phone,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  async createOrder(data: NewOrder): Promise<{ order_id: string; payment_url?: string }> {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.pool.getConnection();
      await connection.beginTransaction();

      // Tạo địa chỉ giao hàng
      const addressId = uuidToBinary(uuidv4());
      await connection.execute<ResultSetHeader>(
        `INSERT INTO order_addresses (
          id, full_address_line, house_number, street_name, neighborhood, ward, city, country, recipient_name, recipient_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          addressId,
          data.order_address.full_address_line,
          data.order_address.house_number || null,
          data.order_address.street_name || null,
          data.order_address.neighborhood || null,
          data.order_address.ward || null,
          data.order_address.city || null,
          data.order_address.country || 'Vietnam',
          data.order_address.recipient_name,
          data.order_address.recipient_phone,
        ]
      );

      // Tính tổng tiền
      const totalAmount = data.items.reduce((total, item) => total + item.price * item.quantity, 0);

      // Tạo đơn hàng
      const orderId = uuidToBinary(uuidv4());
      await connection.execute<ResultSetHeader>(
        `INSERT INTO orders (
          id, user_id, order_address_id, total_amount, status, payment_method, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          uuidToBinary(data.user_id),
          addressId,
          totalAmount,
          'PENDING',
          data.payment_method,
          data.note || null,
        ]
      );

      // Tạo các mục đơn hàng
      for (const item of data.items) {
        const itemId = uuidToBinary(uuidv4());
        await connection.execute<ResultSetHeader>(
          `INSERT INTO order_items (
            id, order_id, product_id, quantity, price, size_value, product_name, product_image
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            itemId,
            orderId,
            uuidToBinary(item.product_id),
            item.quantity,
            item.price,
            item.size_value,
            item.product_name,
            item.product_image || null,
          ]
        );
      }

      // Xử lý thanh toán (giả lập, cần tích hợp với cổng thanh toán thực tế)
      let paymentUrl: string | undefined;
      if (data.payment_method === 'momo' || data.payment_method === 'zalopay') {
        paymentUrl = `https://payment-gateway.com/pay?order_id=${binaryToUuid(orderId)}&amount=${totalAmount}`;
      }

      await connection.commit();
      return { order_id: binaryToUuid(orderId), payment_url: paymentUrl };
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error creating order:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.pool.getConnection();
      const [orderRows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM orders WHERE id = ?`,
        [uuidToBinary(id)]
      );

      if (!orderRows[0]) return null;

      const order = this.mapRowToOrder(orderRows[0]);

      const [itemRows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [uuidToBinary(id)]
      );
      order.items = itemRows.map(this.mapRowToOrderItem);

      const [addressRows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM order_addresses WHERE id = ?`,
        [uuidToBinary(order.order_address_id)]
      );
      order.address = this.mapRowToOrderAddress(addressRows[0]);

      return order;
    } finally {
      if (connection) connection.release();
    }
  }
}