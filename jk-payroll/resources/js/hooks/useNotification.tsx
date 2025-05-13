// src/hooks/useNotification.ts
import { notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';

type NotificationType = 'success' | 'error';

const useNotification = () => {
  const openNotification = (
    type: NotificationType,
    title: string,
    description: string,
    placement: NotificationPlacement = 'topRight'
  ) => {
    notification[type]({
      message: title,
      description,
      placement,
    });
  };

  const notifySuccess = (title: string, description: string) => {
    openNotification('success', title, description);
  };

  const notifyError = (title: string, description: string) => {
    openNotification('error', title, description);
  };

  return {
    notifySuccess,
    notifyError,
  };
};

export default useNotification;
