const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ============================================
  // SEED PERMISSIONS
  // ============================================
  console.log('Creating permissions...');
  const defaultPermissions = [
    // Employees
    { resource: 'employees', action: 'view', name: 'view_employees', displayName: 'Xem nhân viên', description: 'Xem danh sách và chi tiết nhân viên' },
    { resource: 'employees', action: 'create', name: 'create_employee', displayName: 'Tạo nhân viên', description: 'Tạo nhân viên mới' },
    { resource: 'employees', action: 'update', name: 'update_employee', displayName: 'Cập nhật nhân viên', description: 'Chỉnh sửa thông tin nhân viên' },
    { resource: 'employees', action: 'delete', name: 'delete_employee', displayName: 'Xóa nhân viên', description: 'Xóa nhân viên' },
    
    // Roles
    { resource: 'roles', action: 'view', name: 'view_roles', displayName: 'Xem vai trò', description: 'Xem danh sách vai trò' },
    { resource: 'roles', action: 'create', name: 'create_role', displayName: 'Tạo vai trò', description: 'Tạo vai trò mới' },
    { resource: 'roles', action: 'update', name: 'update_role', displayName: 'Cập nhật vai trò', description: 'Chỉnh sửa vai trò' },
    { resource: 'roles', action: 'delete', name: 'delete_role', displayName: 'Xóa vai trò', description: 'Xóa vai trò' },
    
    // Customers
    { resource: 'customers', action: 'view', name: 'view_customers', displayName: 'Xem khách hàng', description: 'Xem danh sách khách hàng' },
    { resource: 'customers', action: 'create', name: 'create_customer', displayName: 'Tạo khách hàng', description: 'Tạo khách hàng mới' },
    { resource: 'customers', action: 'update', name: 'update_customer', displayName: 'Cập nhật khách hàng', description: 'Chỉnh sửa thông tin khách hàng' },
    { resource: 'customers', action: 'delete', name: 'delete_customer', displayName: 'Xóa khách hàng', description: 'Xóa khách hàng' },
    
    // Pets
    { resource: 'pets', action: 'view', name: 'view_pets', displayName: 'Xem thú cưng', description: 'Xem hồ sơ thú cưng' },
    { resource: 'pets', action: 'create', name: 'create_pet', displayName: 'Tạo hồ sơ thú cưng', description: 'Tạo hồ sơ thú cưng mới' },
    { resource: 'pets', action: 'update', name: 'update_pet', displayName: 'Cập nhật hồ sơ', description: 'Cập nhật hồ sơ thú cưng' },
    
    // Appointments
    { resource: 'appointments', action: 'view', name: 'view_appointments', displayName: 'Xem lịch hẹn', description: 'Xem lịch hẹn' },
    { resource: 'appointments', action: 'create', name: 'create_appointment', displayName: 'Tạo lịch hẹn', description: 'Tạo lịch hẹn mới' },
    { resource: 'appointments', action: 'update', name: 'update_appointment', displayName: 'Cập nhật lịch hẹn', description: 'Cập nhật lịch hẹn' },
    { resource: 'appointments', action: 'delete', name: 'cancel_appointment', displayName: 'Hủy lịch hẹn', description: 'Hủy lịch hẹn' },
    
    // Services
    { resource: 'services', action: 'view', name: 'view_services', displayName: 'Xem danh sách dịch vụ', description: 'Xem danh sách dịch vụ' },
    { resource: 'services', action: 'create', name: 'create_service', displayName: 'Thêm dịch vụ', description: 'Thêm dịch vụ mới' },
    { resource: 'services', action: 'update', name: 'update_service', displayName: 'Chỉnh sửa dịch vụ', description: 'Chỉnh sửa dịch vụ' },
    
    // Products
    { resource: 'products', action: 'view', name: 'view_products', displayName: 'Xem sản phẩm', description: 'Xem danh sách sản phẩm' },
    { resource: 'products', action: 'manage', name: 'manage_inventory', displayName: 'Quản lý kho', description: 'Quản lý kho hàng' },
    { resource: 'products', action: 'create', name: 'create_product', displayName: 'Thêm sản phẩm', description: 'Thêm sản phẩm mới' },
    
    // Reports
    { resource: 'reports', action: 'view', name: 'view_reports', displayName: 'Xem báo cáo doanh thu', description: 'Xem báo cáo doanh thu' },
    { resource: 'reports', action: 'view', name: 'view_employee_reports', displayName: 'Xem báo cáo nhân viên', description: 'Xem báo cáo nhân viên' },
    { resource: 'reports', action: 'export', name: 'export_reports', displayName: 'Export báo cáo', description: 'Export báo cáo' },
    
    // Settings
    { resource: 'settings', action: 'manage', name: 'manage_settings', displayName: 'Cài đặt hệ thống', description: 'Quản lý cài đặt hệ thống' },
    { resource: 'settings', action: 'manage', name: 'manage_email_settings', displayName: 'Cài đặt email', description: 'Quản lý cài đặt email' },
    { resource: 'settings', action: 'manage', name: 'manage_payment_settings', displayName: 'Quản lý thanh toán', description: 'Quản lý cài đặt thanh toán' },
  ];

  const createdPermissions = [];
  for (const perm of defaultPermissions) {
    const permission = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    createdPermissions.push(permission);
  }
  console.log(`Created ${createdPermissions.length} permissions`);

  // ============================================
  // SEED ROLES
  // ============================================
  console.log('Creating roles...');
  
  // Admin role - có tất cả quyền
  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
      description: 'Quản trị viên có toàn quyền',
      isSystem: true,
      permissions: {
        connect: createdPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Manager role
  const managerPerms = createdPermissions.filter(p => 
    ['view_employees', 'create_employee', 'update_employee', 
     'view_customers', 'create_customer', 'update_customer',
     'view_reports', 'export_reports'].includes(p.name)
  );
  const managerRole = await prisma.role.upsert({
    where: { slug: 'manager' },
    update: {},
    create: {
      name: 'Manager',
      slug: 'manager',
      description: 'Quản lý',
      isSystem: false,
      permissions: {
        connect: managerPerms.map(p => ({ id: p.id })),
      },
    },
  });

  // Veterinarian role
  const vetPerms = createdPermissions.filter(p => 
    ['view_customers', 'view_pets', 'update_pet',
     'view_appointments', 'update_appointment'].includes(p.name)
  );
  const veterinarianRole = await prisma.role.upsert({
    where: { slug: 'veterinarian' },
    update: {},
    create: {
      name: 'Veterinarian',
      slug: 'veterinarian',
      description: 'Bác sĩ thú y',
      isSystem: false,
      permissions: {
        connect: vetPerms.map(p => ({ id: p.id })),
      },
    },
  });

  // Receptionist role
  const receptionistPerms = createdPermissions.filter(p => 
    ['view_customers', 'create_customer', 'update_customer',
     'view_appointments', 'create_appointment', 'update_appointment'].includes(p.name)
  );
  const receptionistRole = await prisma.role.upsert({
    where: { slug: 'receptionist' },
    update: {},
    create: {
      name: 'Receptionist',
      slug: 'receptionist',
      description: 'Lễ tân',
      isSystem: false,
      permissions: {
        connect: receptionistPerms.map(p => ({ id: p.id })),
      },
    },
  });

  console.log('Roles created: Admin, Manager, Veterinarian, Receptionist');

  // Create price channels
  const channels = await Promise.all([
    prisma.priceChannel.upsert({
      where: { code: 'ONLINE' },
      update: {},
      create: {
        code: 'ONLINE',
        name: 'Online',
        description: 'Online store',
      },
    }),
    prisma.priceChannel.upsert({
      where: { code: 'OFFLINE' },
      update: {},
      create: {
        code: 'OFFLINE',
        name: 'Offline',
        description: 'Physical store',
      },
    }),
    prisma.priceChannel.upsert({
      where: { code: 'APP' },
      update: {},
      create: {
        code: 'APP',
        name: 'Mobile App',
        description: 'Mobile application',
      },
    }),
    prisma.priceChannel.upsert({
      where: { code: 'MARKETPLACE' },
      update: {},
      create: {
        code: 'MARKETPLACE',
        name: 'Marketplace',
        description: 'Third-party marketplace',
      },
    }),
  ]);

  // Create price regions
  const regions = await Promise.all([
    prisma.priceRegion.upsert({
      where: { code: 'NORTH' },
      update: {},
      create: {
        code: 'NORTH',
        name: 'Miền Bắc',
        description: 'Northern region',
      },
    }),
    prisma.priceRegion.upsert({
      where: { code: 'CENTRAL' },
      update: {},
      create: {
        code: 'CENTRAL',
        name: 'Miền Trung',
        description: 'Central region',
      },
    }),
    prisma.priceRegion.upsert({
      where: { code: 'SOUTH' },
      update: {},
      create: {
        code: 'SOUTH',
        name: 'Miền Nam',
        description: 'Southern region',
      },
    }),
    prisma.priceRegion.upsert({
      where: { code: 'INTERNATIONAL' },
      update: {},
      create: {
        code: 'INTERNATIONAL',
        name: 'Quốc tế',
        description: 'International',
      },
    }),
  ]);

  // Create customer groups
  const customerGroups = await Promise.all([
    prisma.customerGroup.upsert({
      where: { code: 'RETAIL' },
      update: {},
      create: {
        code: 'RETAIL',
        name: 'Lẻ',
        description: 'Retail customers',
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'WHOLESALE' },
      update: {},
      create: {
        code: 'WHOLESALE',
        name: 'Sỉ',
        description: 'Wholesale customers',
        discount: 10,
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'VIP' },
      update: {},
      create: {
        code: 'VIP',
        name: 'VIP',
        description: 'VIP customers',
        discount: 15,
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'AGENT_1' },
      update: {},
      create: {
        code: 'AGENT_1',
        name: 'Đại lý cấp 1',
        description: 'Level 1 Agent',
        discount: 20,
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'AGENT_2' },
      update: {},
      create: {
        code: 'AGENT_2',
        name: 'Đại lý cấp 2',
        description: 'Level 2 Agent',
        discount: 25,
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'AGENT_3' },
      update: {},
      create: {
        code: 'AGENT_3',
        name: 'Đại lý cấp 3',
        description: 'Level 3 Agent',
        discount: 30,
      },
    }),
  ]);

  // Create sample categories
  const rootCategory = await prisma.category.upsert({
    where: { slug: 'root' },
    update: {},
    create: {
      name: 'Root Category',
      slug: 'root',
      level: 0,
    },
  });

  console.log('Seed completed!');
  console.log(`Created ${createdPermissions.length} permissions`);
  console.log(`Created 4 roles (Admin, Manager, Veterinarian, Receptionist)`);
  console.log(`Created ${channels.length} price channels`);
  console.log(`Created ${regions.length} price regions`);
  console.log(`Created ${customerGroups.length} customer groups`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
