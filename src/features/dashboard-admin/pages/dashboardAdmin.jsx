import React from 'react';

import { AdminLayout } from '../../shared/components/navigations';
import { DashboardContent } from '../components'; 



export default function DashboardAdmin() {

  return (
    <AdminLayout>
        <DashboardContent />
    </AdminLayout>
  );
}
