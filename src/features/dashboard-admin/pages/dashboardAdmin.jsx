import React from 'react';

import { AdminLayout } from '../../shared/components/navigations';
import { DashboardContent } from '../components'; 
import GlobalBackground from '../../dashboard-user/components/global-background';


export default function DashboardAdmin() {

  return (
    <AdminLayout>
      <GlobalBackground>
        <DashboardContent />
      </GlobalBackground>
    </AdminLayout>
  );
}
