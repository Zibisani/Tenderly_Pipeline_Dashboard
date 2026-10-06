import { TakeAppAdapter, TakeAppCustomer, TakeAppOrder } from '../../types/integrations';
const MOCK_CUSTOMERS: TakeAppCustomer[] = [
  { id: 'ta_cust_1', name: 'Lesego Mokobi', phone: '26771234567', created_at: new Date().toISOString() },
  { id: 'ta_cust_2', name: 'Kefilwe Nteta', phone: '+267 72 345 678', created_at: new Date().toISOString() },
  { id: 'ta_cust_3', name: 'Boitumelo Phiri', phone: '73456789', created_at: new Date().toISOString() },
  { id: 'ta_cust_4', name: 'Thabo Mosh', phone: '74567890', created_at: new Date().toISOString() },
  { id: 'ta_cust_5', name: 'Tshepo Dube', phone: '075678901', created_at: new Date().toISOString() },
  { id: 'ta_cust_6', name: 'Masego Molefe', phone: '0026776789012', created_at: new Date().toISOString() },
  { id: 'ta_cust_7', name: 'Kagiso Tau', phone: '77890123', created_at: new Date().toISOString() },
  { id: 'ta_cust_8', name: 'Lebogang Nku', phone: '78901234', created_at: new Date().toISOString() },
];
const MOCK_ORDERS: TakeAppOrder[] = [
  { id: 'ta_order_1', customer_id: 'ta_cust_3', status: 'reserved', total: 2500, paid: 1250, balance: 1250, reserved_at: new Date().toISOString(), created_at: new Date().toISOString(), items: [] }
];
export class MockTakeAppAdapter implements TakeAppAdapter {
  async getCustomers(): Promise<TakeAppCustomer[]> { return MOCK_CUSTOMERS; }
  async getOrders(): Promise<TakeAppOrder[]> { return MOCK_ORDERS; }
  async getOrdersByCustomer(customerId: string): Promise<TakeAppOrder[]> { return MOCK_ORDERS.filter(o => o.customer_id === customerId); }
}
export function getTakeAppAdapter(): TakeAppAdapter { return new MockTakeAppAdapter(); }
