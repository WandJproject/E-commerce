export const customers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', orders: 12, spent: 1840.5, joined: '2023-02-14', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', orders: 8, spent: 960.2, joined: '2023-05-02', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', orders: 3, spent: 210.0, joined: '2024-01-10', status: 'Active' },
  { id: 4, name: 'Sarah Williams', email: 'sarah.williams@example.com', orders: 20, spent: 3420.75, joined: '2022-11-30', status: 'VIP' },
  { id: 5, name: 'David Brown', email: 'david.brown@example.com', orders: 1, spent: 129.99, joined: '2024-06-18', status: 'Inactive' },
  { id: 6, name: 'Emily Davis', email: 'emily.davis@example.com', orders: 6, spent: 540.4, joined: '2023-09-21', status: 'Active' },
]

export const coupons = [
  { id: 1, code: 'WELCOME10', discount: '10%', type: 'Percentage', expires: '2026-12-31', status: 'Active', uses: 245 },
  { id: 2, code: 'FREESHIP', discount: '$0 Shipping', type: 'Shipping', expires: '2026-09-30', status: 'Active', uses: 120 },
  { id: 3, code: 'SUMMER25', discount: '25%', type: 'Percentage', expires: '2026-08-15', status: 'Active', uses: 88 },
  { id: 4, code: 'FLASH50', discount: '$50', type: 'Fixed', expires: '2026-01-01', status: 'Expired', uses: 302 },
]

export const reviews = [
  { id: 1, product: 'Sony WH-1000XM5 Wireless Headphones', customer: 'John Doe', rating: 5, comment: 'Amazing noise cancellation, worth every penny.', date: '2024-07-15' },
  { id: 2, product: 'Nike Air Max 270', customer: 'Jane Smith', rating: 4, comment: 'Comfortable but runs slightly small.', date: '2024-07-12' },
  { id: 3, product: 'Fossil Gen 6 Smartwatch', customer: 'Mike Johnson', rating: 5, comment: 'Battery life is better than expected.', date: '2024-07-10' },
  { id: 4, product: 'Classic Leather Bag', customer: 'Sarah Williams', rating: 4, comment: 'Beautiful bag, smells like real leather.', date: '2024-07-08' },
]
