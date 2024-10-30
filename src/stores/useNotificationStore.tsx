import { create } from 'zustand';

export type NotificationType = {
    title: string;
    description: string;
    target: string;
    createdAt: string

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

export type CreateNotificationFormData = {
  title?: string;
  description?: string;
  jobTitles?: string;
}

 interface NotificationStoreState {
  notifications:  NotificationType[];
  setNotifications: (notifications: NotificationType[]) => void;
  showCreateNotification: boolean;
  setShowCreateNotification: (val: boolean) => void;
  // resetData: () => void;
  formData: CreateNotificationFormData;
  setFormData: (formData: CreateNotificationFormData) => void;


}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],
  setNotifications: (notifications: any) => set({ notifications }),
  showCreateNotification: false,
  setShowCreateNotification: (val) => set(() => ({ showCreateNotification: val })),
  // resetData: () => {
  //   set(() => ({ formData: null  }));
  // },

  formData: {
    title: "",
    description: "",
    jobTitles: "",
  },


  setFormData: (formData) => set({ formData }),


}));
