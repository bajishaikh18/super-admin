import { create } from 'zustand';

export type NotificationType = {
    title: string;
    description: string;

}

export interface Notification {
    type: string,
    _id: string,
    title: string,
    description: string,
    userId: string,
    dismissed: boolean,
    createdAt: string,
    updatedAt: string,
    __v: number
}

interface NotificationStoreState {
  notifications:  NotificationType[];
  setNotifications: (notifications: NotificationType[]) => void;
  showCreateNotification: boolean;
  setShowCreateNotification: (val: boolean) => void;

}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],
  setNotifications: (notifications: any) => set({ notifications }),
  showCreateNotification: false,
  setShowCreateNotification: (val) => set(() => ({ showCreateNotification: val })),

}));
