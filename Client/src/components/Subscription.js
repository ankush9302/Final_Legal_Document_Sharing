import React from 'react';

function Subscription() {
  // Dummy data for subscriptions
  const subscriptions = [
    { id: 1, serviceName: 'WHATSAPP', planName: 'Standard', expirationDate: '2024-06-30' },
    { id: 2, serviceName: 'SMS', planName: 'Premium', expirationDate: '2024-05-15' },
    { id: 3, serviceName: 'EMAIL', planName: 'Annual', expirationDate: '2025-01-01' },
  ];

  const calculateRemainingDays = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleRenew = (serviceName) => {
    // TODO: Implement renewal logic
    console.log(`Renewing subscription for ${serviceName}`);
  };

  return (
    <div className="subscription-container">
      <h2>Your Subscriptions</h2>
      {subscriptions.map((sub) => (
        <div key={sub.id} className="subscription-item">
          <h3>{sub.serviceName}</h3>
          <p>Plan: {sub.planName}</p>
          <p>Expiration Date: {new Date(sub.expirationDate).toLocaleDateString()}</p>
          <p>Remaining Days: {calculateRemainingDays(sub.expirationDate)}</p>
          <button onClick={() => handleRenew(sub.serviceName)} className="renew-button">
            Renew Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default Subscription;
