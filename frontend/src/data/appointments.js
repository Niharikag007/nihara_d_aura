// Mock appointments data for Nihara D'Aura salon booking admin

const appointments = [
  { id: 'APT-501', client: 'Priya Sharma', phone: '+91 98765 43210', service: 'Royal bridal glow package', price: 18500, date: '2026-10-16', time: '13:00', duration: 180, artist: 'Ananya Verma', location: 'At home – Jubilee Hills, Hyderabad', status: 'Confirmed', notes: 'Bridal trial – wants soft pink tones' },
  { id: 'APT-502', client: 'Meera Reddy', phone: '+91 87654 32109', service: 'Celebrity glam party makeup', price: 6500, date: '2026-10-15', time: '16:00', duration: 90, artist: 'Ananya Verma', location: 'At salon – Bandra flagship', status: 'Confirmed', notes: '' },
  { id: 'APT-503', client: 'Kavita Iyer', phone: '+91 99887 76655', service: 'Rose quartz gel nail extensions', price: 3800, date: '2026-10-15', time: '11:00', duration: 120, artist: 'Sunita Nair', location: 'At salon – Bandra flagship', status: 'Confirmed', notes: 'Wants chrome finish' },
  { id: 'APT-504', client: 'Tanya Singh', phone: '+91 76543 21098', service: 'HD airbrush makeup', price: 8500, date: '2026-10-17', time: '10:00', duration: 120, artist: 'Ananya Verma', location: 'At home – Defence Colony, Delhi', status: 'Pending', notes: 'Engagement ceremony' },
  { id: 'APT-505', client: 'Roshni Patel', phone: '+91 88776 65544', service: 'French tip soft-gel extensions', price: 2800, date: '2026-10-14', time: '15:00', duration: 90, artist: 'Sunita Nair', location: 'At salon – Bandra flagship', status: 'Completed', notes: '' },
  { id: 'APT-506', client: 'Deepa Menon', phone: '+91 81234 09876', service: 'Luxury facial & cleanup', price: 4500, date: '2026-10-13', time: '14:00', duration: 60, artist: 'Pooja Rao', location: 'At salon – Bandra flagship', status: 'Completed', notes: 'Sensitive skin – patch test done' },
  { id: 'APT-507', client: 'Neha Gupta', phone: '+91 70012 34567', service: 'Royal bridal glow package', price: 18500, date: '2026-10-18', time: '09:00', duration: 180, artist: 'Ananya Verma', location: 'At home – Sector 44, Gurgaon', status: 'Confirmed', notes: 'Wedding day – needs full bridal set' },
  { id: 'APT-508', client: 'Sakshi Jain', phone: '+91 92345 67890', service: 'Nail art design session', price: 2200, date: '2026-10-12', time: '17:00', duration: 75, artist: 'Sunita Nair', location: 'At salon – Bandra flagship', status: 'Cancelled', notes: 'Client rescheduled' },
];

export const services = [
  { id: 'SVC-01', name: 'Royal bridal glow package', price: 18500, duration: 180, category: 'Bridal' },
  { id: 'SVC-02', name: 'Celebrity glam party makeup', price: 6500, duration: 90, category: 'Makeup' },
  { id: 'SVC-03', name: 'HD airbrush makeup', price: 8500, duration: 120, category: 'Makeup' },
  { id: 'SVC-04', name: 'Rose quartz gel nail extensions', price: 3800, duration: 120, category: 'Nails' },
  { id: 'SVC-05', name: 'French tip soft-gel extensions', price: 2800, duration: 90, category: 'Nails' },
  { id: 'SVC-06', name: 'Nail art design session', price: 2200, duration: 75, category: 'Nails' },
  { id: 'SVC-07', name: 'Luxury facial & cleanup', price: 4500, duration: 60, category: 'Skin' },
  { id: 'SVC-08', name: 'Hair styling & blowout', price: 3500, duration: 60, category: 'Hair' },
];

export const artists = ['Ananya Verma', 'Sunita Nair', 'Pooja Rao'];

export default appointments;
