window.Lang = window.Lang || {};
window.Lang['en-US'] = {
  session: {
    signin_tips: 'Signin first!',
  },
  drop_here_to_upload: 'Drag and drop files here or click to select the uploaded file',
  signin: 'Signin',
  profile: "Profile",
  signout: "Signout",
  close: "Close",
  confirm: "OK",
  quantity: "Quantity",
  index: "Home",
  operations: "Operation",
  name: "Name",
  delete_confirm: "Are you sure you delete the selected items?",
  batch_items_empty: "You have not selected any items",
  batch_action_empty: "You have not selected operation requires the application of",
  batch_action_not_implement: "you select the operation has not been implemented",
  batch_enable_confirm: 'Enable all of selected items?',
  batcn_disable_confirm: 'Disable all of selected items?',
  enable: "Enable",
  disable: "Disabled",
  apply: "Apply",
  keywords: "keyword",
  create: "Create",
  edit: "Edit",
  cancel: "Cancel",
  delete: "Delete",
  title: "Title",
  submit: "Submit",
  submit_successfully: "Success!",
  batch_action: "Operation",
  saving: "Saving...",
  save: "Save",
  saved: "Saved",
  dashboard: {
    title: "Dashboard",
    subtitle: "Welcome",
  },
  address: {
    title: "Shipping Address",
    subtitle: "Manage your shipping address",
    form_title: 'Add / Edit shipping address',
    consignee: "Consignee",
    address: 'Address',
    region: 'State/Province,City',
    region_placeholder: 'Format: State/Province,City',
    zipcode: 'Zipcode',
    mobile: 'Mobile Phone',
    phone: 'Landline',
    email: 'E-Mail',
  },
  product: {
    title: "Product List",
    subtitle: "Managing Your product",
    id: "ID",
    name: "Product Name",
    min_price: "Starting Price",
    price: "Price",
    price_invalid: "Price must be a number",
    price_placeholder: "Price",
    edit_stock: "Edit stock",
    sku: "SKU",
    sku_button: "Generate SKU",
    sku_placeholder: "SKU",
    stock: "Inventory",
    stock_invalid: "Inventory must be numeric",
    stock_placeholder: "Please enter the current inventory",
    create: "Create",
    create_subtitle: "You can edit, add, or modify any product here",
    category_placeholder: "Select Category",
    gallery: "Gallery",
    option: {
      name: "Name",
      options: "Available Options",
      create: "Add",
      edit: "Edit Options",
    },
    form: {
      basic: "Basic Information",
      name_placeholder: "eg. iPhone 6 Plus",
      desc: "Product Description",
      desc_placeholder: "Product Description",
      price_and_stock: "Price and Inventory",
      edit_options: "Edit Options",
      drop_here_to_upload: "Drag and drop files or click here",
    },
    status: "Status",
    enable: "Enable",
    disable: "Disable",
    category: "Category",
    delete_option_group_confirm: "You will delete the entire set of options, remove this option will also permanently delete the following stock, sure to delete it \ n?",
    delete_option_confirm: "remove this option will also permanently delete the following stock, sure to delete it \ n?",
    stock_exists: "${option} is already exists",
  },
  category: {
    title: 'Category',
    subtitle: 'Manage category here',
    form_title: 'Add / Edit Category',
    name: "Category Name",
    parent: "Parent",
    parent_placeholder: "Root",
  },
  menu: {
    index: "Home",
    product: "Product",
    product_index: "Products",
    product_category: "Categories",
    transaction: "Transation",
    order: "Orders",
    refund: "refunds",
    logistics: "Logistics",
    payment: "Payments",
    cms: "CMS",
    file: "Files",
    page: "Pages",
    system: "System",
    admin: "Administrators",
    role: "Roles",
    user: "Users",
  },
  order: {
    operations: {
      pay: 'Pay',
      edit: 'Edit',
      cancel: 'Cancel',
      confirm: 'OK',
      complete: 'Completed',
      ship: 'Ship',
      refund: 'Refund',
      refund_and_cancel: 'Refund and Cancellation',
      branch: 'Branch',
      branch_revert: 'Restore',
      branch_after: 'Branch Confirmed',
    },
    status: {
      all: "Any",
      pending: 'Pending',
      confirmed: 'Confirmed',
      unpaid: 'Unpaid',
      paid: 'Paid',
      unshipped: 'Unfilled',
      shipped: 'Shipped',
      completed: 'Completed',
      canceled: 'Cancelled',
      branched: 'Branched',
      payment: 'Payment Status',
      logistics: "Logistics Status",
    },
    filter: {
      date: "Created at",
    },
    order_status: "Order Status",
    updated_at: "Last Updated",
    payment: 'Payment',
    total_amount: 'Order Amount',
    consignee: "Consignee",
    created_at: "Created at",
    logistics_cod: "Cash on Delivery",
    logistics_time: "Delivery time",
    logistics_tracking_number: "Tracking Number",
    sn: "Order SN",
    id: "Order ID",
    user_id: "User ID",
    payment_time: "Paid time",
    refundable_amount: "Refundable Amount",
    payment_notice: "Please pay promptly",
    cancel: "Cancel Order",
    cancel_warning: "Proceed with caution, this operation can not be restored",
    comment: "Remarks",
    check_amount: 'Check the Amount',
    subtotal_product: "Subtotal of Products",
    subtotal_logistics: "Subtotal of Logistics",
    total_refunded: "Refunded",
    total_amount: "Total",
    edit_tracking_number: 'Edit the tracking number',
    logs: 'Logs',
    comment_empty: "No Action Remarks",
    logs_empty: "None",
    quantity: "Quantity",
    edit_consignee: "Modify the consignee information",
    dangerous_warning: "Proceed with caution, this operation can not be restored",
    total_paid: "Total Paid",
    title: "Order List",
    subtitle: "Manage Your Orders",
    show: "View Order",
  },
  logistics: {
    title: 'Logistics List',
    subtitle: 'Logistics Information Management',
    name: 'Logistics name',
    status: 'Enabled',
    created_at: 'Created at',
    desc: 'Logistics Description',
    form_title: 'Add / Edit Logistics',
    deliverer_name: 'Deliverer Name',
    deliverer_name_placeholder: 'Select the corresponding Develierer Plugin and Set Up',
  },
  payment: {
    title: 'Payment',
    subtitle: 'Manage all your payment methods',
    name: 'Payment Name',
    status: 'Enabled',
    created_at: 'Created at',
    desc: 'Payment Description',
    form_title: 'Add / Edit Payment',
    gateway_name: 'Payment Gateway',
    gateway_name_placeholder: 'Select the corresponding Gateway Plugin and Set Up',
  },
  file: {
    title: "File List",
    subtitle: 'Manage all uploaded files',
    upload_successfully: "Uploaded successfully",
    copied: "File Path: ${path} has been copied to clipboard",
    copy_path: "Copy the file path",
  },
  page: {
    title: "Page List",
    subtitle: 'Manage all your custom page',
    page_title: "Title",
    page_title_placeholder:"Will be used as page title and link name.",
    pathname: "Pathname",
    pathname_placeholder: "URL uniquely identifies, eg. watch indicates http://yourdomain/watch",
    position: "Position",
    position_placeholder: "The same position can be a group show,",
    sort_index: "Sort Index",
    sort_index_placeholder: "When the position is the same, you can set the order, in ascending order.",
    created_at: "Created at",
    settings: "Settings",
    settings_example: "Example",
    form_title:"Add / Edit Page",
  },
  refund: {
    operations: {
      pay: 'Pay',
      edit: 'Edit',
      cancel: 'Cancel',
      confirm: 'OK',
      complete: 'Completed',
      refund: 'Refund',
      returns: 'Return',
    },
    status: {
      all: "Any",
      pending: 'Pending',
      confirmed: 'Confirmed',
      unpaid: 'Unpaid',
      paid: 'Paid',
      completed: 'Completed',
      canceled: 'Cancelled',
      payment: 'Payment Status',
    },
    filter: {
      date: "Created at",
    },
    show: "View Refund",
    order_sn: "Order SN",
    updated_at: "Last Updated",
    created_at: "Created at",
    refund_status: "Refund Status",
    payment: 'Payment',
    title: "Refund list",
    subtitle: "Manage all your refund",
    total_amount: 'Refund Amount',
    sn: "Refund SN",
    id: "Refund ID",
    quantity: "Quantity",
    user_id: "User ID",
    payment_time: "Paid time",
    payment_notice: "Please pay promptly",
    cancel: "Cancel",
    cancel_warning: "Proceed with caution, this operation can not be restored",
    comment: "Remarks",
    reason: "Reason",
    check_amount: "Check Amount",
    logs: "Logs",
    comment_empty: "None",
    logs_empty: "None",
    subtotal: "Subtotal",
  },
  admin: {
    title: "Administrator",
    subtitle: "Management system, all administrators",
    name: "Username",
    email: "Email",
    created_at: "Created at",
    role: "Role",
    password: "Password",
    password_confirm: "Enter the password again to confirm",
    password_inconsistent: "The two passwords do not match",
    form_title: "Add / Edit Administrator",
  },
  role: {
    title: "Role List",
    subtitle: "Management system for all roles,",
    name: "Role Name",
    scope: "Permission Scopes",
    scope_all: "All",
    scope_order: "Transaction",
    scope_product: "Product",
    scope_cms: "CMS",
    created_at: "Created at",
    form_title: "Add / Edit Role",
  },
  user: {
    title: "User",
    subtitle: "Management system for all users",
    name: "Username",
    nickname: "Nickname",
    email: "Email",
    created_at: "Created at",
    password: "Password",
    password_confirm: "Password Again",
    password_confirm_placeholder: "Enter the password again to confirm",
    password_inconsistent: "The two passwords do not match",
    form_title: "Add / Edit Users",
  },
};
