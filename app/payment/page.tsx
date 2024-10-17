// path: app/payment/route.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';
import PaymentPage from '@/components/dashboard/payment';

export default function Payment() {
  return (
    <ProtectedRoute>
      <div>
        <PaymentPage />
      </div>
    </ProtectedRoute>
  );
}