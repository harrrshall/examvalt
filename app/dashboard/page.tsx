// app/dashboard/page.tsx

'use client';



import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardComponent from '@/components/dashboard/dashboard-page';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <DashboardComponent />
      </div>
    </ProtectedRoute>
  );
}