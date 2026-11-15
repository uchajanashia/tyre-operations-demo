import { Component, HostListener, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type DemoView = 'overview' | 'orders' | 'payments' | 'crm' | 'inventory';
type PaymentDecision = 'დასამტკიცებელი' | 'დამტკიცებული' | 'უარყოფილი';

interface Order {
  id: string;
  customer: string;
  vehicle: string;
  total: string;
  status: string;
  age: string;
  channel: string;
  address: string;
  items: string[];
  timeline: { time: string; title: string; note: string }[];
}

interface Payment {
  id: string;
  customer: string;
  amount: string;
  method: string;
  signal: string;
  submitted: string;
}

interface Customer {
  id: string;
  name: string;
  segment: string;
  contact: string;
  vehicle: string;
  orders: number;
  value: string;
  lastOrder: string;
  note: string;
}

interface StockItem {
  sku: string;
  product: string;
  warehouse: string;
  available: number;
  reserved: number;
  threshold: number;
  movement: string;
}

@Component({
  selector: 'adm-admin-demo-page',
  imports: [FormsModule],
  templateUrl: './admin-demo.page.html',
})
export class AdminDemoPage {
  readonly views: { id: DemoView; label: string; meta: string }[] = [
    { id: 'overview', label: 'მიმოხილვა', meta: '01' },
    { id: 'orders', label: 'შეკვეთები', meta: '12' },
    { id: 'payments', label: 'გადახდები', meta: '04' },
    { id: 'crm', label: 'კლიენტები', meta: '248' },
    { id: 'inventory', label: 'მარაგები', meta: '07' },
  ];

  readonly activeView = signal<DemoView>('overview');
  readonly navOpen = signal(false);
  readonly query = signal('');
  readonly orderFilter = signal('ყველა');
  readonly selectedOrderId = signal('ORD-1048');
  readonly selectedPaymentId = signal('PAY-0814');
  readonly selectedCustomerId = signal('CUS-0248');
  readonly selectedStockSku = signal('MIC-PA5-22545R18');
  readonly paymentStatuses = signal<Record<string, PaymentDecision>>({});
  readonly pendingDecision = signal<{ id: string; action: 'approve' | 'reject' } | null>(null);
  readonly toast = signal('');

  readonly orders: Order[] = [
    {
      id: 'ORD-1048',
      customer: 'დემო — ნინო ქავთარაძე',
      vehicle: 'Toyota RAV4 · 2021',
      total: '₾ 1,840',
      status: 'შეფუთვის რიგში',
      age: '18 წთ',
      channel: 'ონლაინ',
      address: 'თბილისი · საბურთალო (სინთეტიკური)',
      items: ['Michelin Pilot Alpin 5 · 225/45 R18 × 4', 'მონტაჟის დემო-სერვისი × 1'],
      timeline: [
        { time: '14:26', title: 'შეფუთვის რიგში გადავიდა', note: 'დემო საწყობი · თბილისი' },
        { time: '14:18', title: 'გადახდა დადასტურდა', note: 'სინთეტიკური ბარათი •••• 0042' },
        { time: '14:07', title: 'შეკვეთა შეიქმნა', note: 'ონლაინ დემო-არხი' },
      ],
    },
    {
      id: 'ORD-1047',
      customer: 'დემო — შპს ალფა ავტო',
      vehicle: 'Mercedes GLE · 2020',
      total: '₾ 3,260',
      status: 'გადამოწმება',
      age: '31 წთ',
      channel: 'B2B',
      address: 'რუსთავი · ინდუსტრიული ზონა (სინთეტიკური)',
      items: ['Continental WinterContact TS 870 P · 275/50 R20 × 4'],
      timeline: [
        { time: '14:11', title: 'ოპერატორის გადამოწმება', note: 'ფასდაკლების პირობა · დემო' },
        { time: '13:54', title: 'შეკვეთა შეიქმნა', note: 'B2B დემო-არხი' },
      ],
    },
    {
      id: 'ORD-1046',
      customer: 'დემო — ლუკა წერეთელი',
      vehicle: 'BMW X5 · 2019',
      total: '₾ 2,980',
      status: 'კურიერთან',
      age: '1 სთ',
      channel: 'ონლაინ',
      address: 'თბილისი · ვაკე (სინთეტიკური)',
      items: ['Pirelli Scorpion Winter · 255/55 R19 × 4'],
      timeline: [
        { time: '13:42', title: 'კურიერს გადაეცა', note: 'დემო მარშრუტი #7' },
        { time: '12:58', title: 'შეფუთვა დასრულდა', note: 'თბილისის დემო-საწყობი' },
      ],
    },
    {
      id: 'ORD-1045',
      customer: 'დემო — ანა ლომიძე',
      vehicle: 'Kia Sportage · 2022',
      total: '₾ 1,520',
      status: 'ახალი',
      age: '6 წთ',
      channel: 'ქოლ-ცენტრი',
      address: 'ბათუმი · ძველი ქალაქი (სინთეტიკური)',
      items: ['Bridgestone Blizzak LM005 · 215/65 R17 × 4'],
      timeline: [{ time: '14:39', title: 'შეკვეთა შეიქმნა', note: 'ქოლ-ცენტრის დემო-არხი' }],
    },
  ];

  readonly payments: Payment[] = [
    {
      id: 'PAY-0814',
      customer: 'დემო — შპს ალფა ავტო',
      amount: '₾ 3,260',
      method: 'ინვოისი',
      signal: 'თანხა ემთხვევა',
      submitted: '13:58',
    },
    {
      id: 'PAY-0813',
      customer: 'დემო — გიორგი ბერიძე',
      amount: '₾ 2,140',
      method: 'ბანკის გადარიცხვა',
      signal: 'დანიშნულება შესამოწმებელია',
      submitted: '13:42',
    },
    {
      id: 'PAY-0812',
      customer: 'დემო — ნინო ქავთარაძე',
      amount: '₾ 1,840',
      method: 'ბარათი',
      signal: '3DS დადასტურებულია',
      submitted: '13:26',
    },
    {
      id: 'PAY-0811',
      customer: 'დემო — შპს კავკასია',
      amount: '₾ 6,720',
      method: 'ინვოისი',
      signal: 'B2B ლიმიტი',
      submitted: '12:51',
    },
  ];

  readonly customers: Customer[] = [
    {
      id: 'CUS-0248',
      name: 'დემო — ნინო ქავთარაძე',
      segment: 'ერთგული',
      contact: 'nino.demo@example.com',
      vehicle: 'Toyota RAV4 · 2021',
      orders: 7,
      value: '₾ 9,840',
      lastOrder: 'დღეს, 14:07',
      note: 'ზამთრის კომპლექტს ყოველ მეორე სეზონზე აახლებს. ჩანაწერი სინთეტიკურია.',
    },
    {
      id: 'CUS-0247',
      name: 'დემო — შპს ალფა ავტო',
      segment: 'B2B',
      contact: 'fleet.demo@example.com',
      vehicle: '12 ავტომობილი · დემო-ფლოტი',
      orders: 18,
      value: '₾ 42,310',
      lastOrder: 'დღეს, 13:54',
      note: 'დემო ფლოტის ანგარიშს სჭირდება ერთიანი ინვოისი.',
    },
    {
      id: 'CUS-0246',
      name: 'დემო — ლუკა წერეთელი',
      segment: 'სტანდარტი',
      contact: 'luka.demo@example.com',
      vehicle: 'BMW X5 · 2019',
      orders: 3,
      value: '₾ 6,120',
      lastOrder: 'დღეს, 12:44',
      note: 'კომუნიკაციის სასურველი არხი: ელფოსტა. სინთეტიკური პროფილი.',
    },
    {
      id: 'CUS-0245',
      name: 'დემო — ანა ლომიძე',
      segment: 'ახალი',
      contact: 'ana.demo@example.com',
      vehicle: 'Kia Sportage · 2022',
      orders: 1,
      value: '₾ 1,520',
      lastOrder: 'დღეს, 14:39',
      note: 'პირველი დემო-შეკვეთა; გადაზიდვა ბათუმში.',
    },
  ];

  readonly stock: StockItem[] = [
    {
      sku: 'MIC-PA5-22545R18',
      product: 'Michelin Pilot Alpin 5 · 225/45 R18',
      warehouse: 'თბილისი',
      available: 24,
      reserved: 8,
      threshold: 12,
      movement: '−4 · 14:26',
    },
    {
      sku: 'CON-TS8-27550R20',
      product: 'Continental TS 870 P · 275/50 R20',
      warehouse: 'თბილისი',
      available: 6,
      reserved: 4,
      threshold: 8,
      movement: '−4 · 13:54',
    },
    {
      sku: 'PIR-SCW-25555R19',
      product: 'Pirelli Scorpion Winter · 255/55 R19',
      warehouse: 'ქუთაისი',
      available: 3,
      reserved: 3,
      threshold: 8,
      movement: '−4 · 12:58',
    },
    {
      sku: 'BRI-LM5-21565R17',
      product: 'Bridgestone Blizzak LM005 · 215/65 R17',
      warehouse: 'ბათუმი',
      available: 14,
      reserved: 4,
      threshold: 10,
      movement: '+12 · 11:42',
    },
    {
      sku: 'NOK-WR4-20555R16',
      product: 'Nokian WR Snowproof · 205/55 R16',
      warehouse: 'ქუთაისი',
      available: 7,
      reserved: 0,
      threshold: 10,
      movement: '−2 · 10:18',
    },
  ];

  readonly filteredOrders = computed(() => {
    const q = this.query().trim().toLocaleLowerCase();
    return this.orders.filter(
      (order) =>
        (this.orderFilter() === 'ყველა' || order.status === this.orderFilter()) &&
        (!q || `${order.id} ${order.customer} ${order.vehicle}`.toLocaleLowerCase().includes(q)),
    );
  });

  readonly filteredCustomers = computed(() => {
    const q = this.query().trim().toLocaleLowerCase();
    return this.customers.filter(
      (customer) =>
        !q || `${customer.id} ${customer.name} ${customer.vehicle}`.toLocaleLowerCase().includes(q),
    );
  });

  readonly selectedOrder = computed(
    () => this.orders.find((order) => order.id === this.selectedOrderId()) ?? this.orders[0],
  );
  readonly selectedPayment = computed(
    () =>
      this.payments.find((payment) => payment.id === this.selectedPaymentId()) ?? this.payments[0],
  );
  readonly selectedCustomer = computed(
    () =>
      this.customers.find((customer) => customer.id === this.selectedCustomerId()) ??
      this.customers[0],
  );
  readonly selectedStock = computed(
    () => this.stock.find((item) => item.sku === this.selectedStockSku()) ?? this.stock[0],
  );
  readonly activeLabel = computed(
    () => this.views.find((view) => view.id === this.activeView())?.label ?? '',
  );

  selectView(view: DemoView): void {
    this.activeView.set(view);
    this.navOpen.set(false);
    this.query.set('');
  }

  toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  paymentStatus(id: string): PaymentDecision {
    return this.paymentStatuses()[id] ?? 'დასამტკიცებელი';
  }

  openDecision(id: string, action: 'approve' | 'reject'): void {
    this.pendingDecision.set({ id, action });
  }

  closeDecision(): void {
    this.pendingDecision.set(null);
  }

  confirmDecision(): void {
    const decision = this.pendingDecision();
    if (!decision) return;
    const status: PaymentDecision = decision.action === 'approve' ? 'დამტკიცებული' : 'უარყოფილი';
    this.paymentStatuses.update((current) => ({ ...current, [decision.id]: status }));
    this.pendingDecision.set(null);
    this.toast.set(`${decision.id} — ${status} (მხოლოდ დემო)`);
  }

  clearToast(): void {
    this.toast.set('');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDecision();
    this.navOpen.set(false);
  }
}
