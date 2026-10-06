export interface TakeAppCustomer { id: string; name: string; phone: string; created_at: string; }
export interface TakeAppOrderItem { id: string; product_name: string; quantity: number; price: number; }
export interface TakeAppOrder { id: string; customer_id: string; status: string; total: number; paid: number; balance: number; reserved_at?: string; delivered_at?: string; created_at: string; items: TakeAppOrderItem[]; }
export interface TakeAppSyncResult { customers: TakeAppCustomer[]; orders: TakeAppOrder[]; }
export interface TakeAppAdapter { getCustomers(): Promise<TakeAppCustomer[]>; getOrders(): Promise<TakeAppOrder[]>; getOrdersByCustomer(customerId: string): Promise<TakeAppOrder[]>; }
export interface ConsultationSheetRow { cl_id: string; name: string; phone: string; consult_date: string; ticket_status: string; outcome: string; quote_value: string; }
export interface MembershipSheetRow { tm_id: string; name: string; phone: string; tier: string; monthly_amount: string; kit_price: string; billing_day: string; payments_made: string; balance: string; status: string; }
export interface SheetDataQualityIssue { rowNum: number; issue: string; rawData: any; }
export interface SheetsSyncResult<T> { data: T[]; issues: SheetDataQualityIssue[]; }
export interface GoogleSheetsAdapter { getConsultations(): Promise<SheetsSyncResult<ConsultationSheetRow>>; getMemberships(): Promise<SheetsSyncResult<MembershipSheetRow>>; }
export interface TickTickTask { id: string; title: string; content: string; dueDate: string; timeZone: string; isAllDay: boolean; priority: number; status: number; projectId: string; tags: string[]; }
export interface TickTickSubtask { id: string; title: string; status: number; }
export interface TickTickReminder { id: string; }
export interface TickTickCreateTaskParams { title: string; content: string; dueDate: string; isAllDay: boolean; priority: number; tags: string[]; }
export interface TickTickUpdateTaskParams { title?: string; content?: string; dueDate?: string; priority?: number; status?: number; }
export interface TickTickAdapter { findByStableKey(key: string): Promise<TickTickTask | null>; createTask(params: TickTickCreateTaskParams): Promise<TickTickTask>; updateTask(id: string, params: TickTickUpdateTaskParams): Promise<TickTickTask>; completeTask(id: string): Promise<void>; }
export interface WebPushSubscription { endpoint: string; keys: { p256dh: string; auth: string; }; }
export interface WebPushPayload { title: string; body: string; icon?: string; badge?: string; data?: any; }
