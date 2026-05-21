// Initialize MongoDB with notification templates
// This script runs automatically when MongoDB container starts for the first time

const db = db.getSiblingDB('ticketbox');

// Create notification_templates collection with default documents
db.notification_templates.insertMany([
  {
    _id: 'payment-only',
    templateId: 'payment-only',
    title: 'Payment Confirmation',
    templateType: 'PAYMENT_ONLY',
    content: 'payment-only',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'payment-with-booking',
    templateId: 'payment-with-booking',
    title: 'Booking & Payment Confirmation',
    templateType: 'PAYMENT_WITH_BOOKING',
    content: 'payment-with-booking',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✓ Notification templates initialized successfully!');
