import React, { useRef, useEffect } from 'react';
import { LiveNotification } from './../../types/index';

interface LiveNotificationsProps {
  notifications: LiveNotification[];
}

const LiveNotifications: React.FC<LiveNotificationsProps> = ({ notifications }) => {
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Scroll to newest notification when a new one is added
  useEffect(() => {
    if (notificationsRef.current) {
      notificationsRef.current.scrollTop = 0;
    }
  }, [notifications]);

  return (
    <div className="notifications-panel">
      <h3>Live Notifications</h3>
      <div className="notifications-container" ref={notificationsRef}>
        {notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <div className="notification-user">
              {notification.user} {notification.type} {notification.quantity} {notification.stockName}
            </div>
            <div className="notification-time">{notification.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveNotifications;