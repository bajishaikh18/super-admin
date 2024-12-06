import { truncateText } from "@/helpers/common";
import styles from "./Notifications.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead, updateNotification } from "@/apis/notification";
import { Notification } from "@/stores/useNotificationStore";
import { Loader, NotFound } from "../Feedbacks";
import { DateTime } from "luxon";
import { useCallback } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "nextjs-toploader/app";

export const Notifications = ({
  notifications,
  isLoading,
  handleClose,
  error,
}: {
  notifications?: Notification[];
  isLoading: boolean;
  handleClose: ()=>void
  error: any;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const notificationsNew = notifications?.filter((notif) => !notif.dismissed);
  const notificationsPrev = notifications?.filter((notif) => notif.dismissed);

  const markAsRead = useCallback(
    async (ids: string[]) => {
      try {
        await markNotificationAsRead({ notificationIds: ids });
        await queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes('user-notifications');
          },
          refetchType:'all'
        })
      } catch {
        toast.error("Something went wrong while marking notification status");
      }
    },
    [notificationsNew]
  );


  const markAllAsRead = useCallback(
    async () => {
      try {
        const ids = notificationsNew?.map(x=>x._id);
        if(ids){
          await markAsRead(ids);
        }
      } catch {
        toast.error("Something went wrong while marking notification status");
      }
    },
    [notificationsNew]
  );

  const openNotification = useCallback(
    async (notification: Notification) => {
      try {
        await markAsRead([notification._id]);
      } catch (e) {}
      if (notification.data) {
        handleClose();
        router.push(notification.data);
      }
    },
    [markAsRead]
  );

  return (
    <div className={styles.notificationPanel}>
      <div className={styles.notificationHeader}>
        <h3>Notifications</h3>
        {
          notificationsNew && notificationsNew?.length > 0 &&   <a className={styles.markAllRead} onClick={markAllAsRead}>
          Mark all as read
        </a>
        }
      
      </div>
      <div className={styles.notificationContentContainer}>
        {isLoading ? (
          <Loader text="Fetching notifications" />
        ) : error ? (
          <NotFound text="Error while fetching notifications" />
        ) : notifications && notifications?.length > 0 ? (
          <>
            <div className={styles.notificationSection}>
              {
                <div className={styles.notificationCreateHeader}>
                  {notificationsNew && notificationsNew?.length > 0 && (
                    <h4>New ({notificationsNew.length})</h4>
                  )}
                  <Link href="/notifications">
                    <FaPlus fontSize={12} /> Create custom
                  </Link>
                </div>
              }
              {notificationsNew?.map((notification) => {
                return (
                  <div
                    key={notification._id}
                    className={styles.notificationItem}
                    onClick={() => openNotification(notification)}
                  >
                    <div className={styles.notificationContent}>
                      <div>
                        <h5>{notification.title}</h5>
                        <p className={styles.notificationDescription}>
                          {truncateText(notification.description, 30)}
                        </p>
                      </div>
                      <time className={styles.notificationTime}>
                        {DateTime.fromISO(notification.createdAt).toRelative()}
                      </time>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className={`${styles.notificationSection} ${styles.dismissed}`}
            >
              {notificationsPrev && notificationsPrev.length > 0 && (
                <div className={styles.notificationCreateHeader}>
                  {" "}
                  <h4>Previous ({notificationsPrev.length})</h4>
                </div>
              )}
              {notificationsPrev?.map((notification) => {
                return (
                  <div
                  key={notification._id}
                    className={styles.notificationItem}
                    onClick={() => openNotification(notification)}
                  >
                    <div className={styles.notificationContent}>
                      <div>
                        <h5>{notification.title}</h5>
                        <p className={styles.notificationDescription}>
                          {truncateText(notification.description, 30)}
                        </p>
                      </div>
                      <time className={styles.notificationTime}>                        {DateTime.fromISO(notification.createdAt).toRelative()}
                      </time>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ):<NotFound text="No notifications yet" /> }
      </div>
    </div>
  );
};
