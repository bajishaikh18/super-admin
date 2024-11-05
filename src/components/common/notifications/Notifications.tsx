import { truncateText } from '@/helpers/common';
import styles from './Notifications.module.scss';
import { useQuery } from '@tanstack/react-query';
import { getUserNotifications, updateNotification } from '@/apis/notification';
import { Notification } from '@/stores/useNotificationStore';
import { Loader, NotFound } from '../Feedbacks';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa6';

export const Notifications = ()=>{
    const {
      data,
      isLoading,
      error,
    } = useQuery<Notification[]>({ queryKey: ["user-notifications"], queryFn: getUserNotifications, retry:1 });
    if(isLoading){
     return <Loader text='Fetching notifications'/>
    } 
    if(error){
     return <NotFound text='Error while fetching notifications'/>
    }
    if(!data){
     return <NotFound text='No notifications'/>
    }

    const notificationsNew = data.filter((notif)=>!notif.dismissed);
    const notificationsPrev = data.filter((notif)=>notif.dismissed);
    const markAsRead = useCallback(async (id:string)=>{
      try{
        await updateNotification(id,{dismissed:true});
      }catch{
        toast.error("Something went wrong while marking notification status");
      }
    },[notificationsNew])
    return (
        <div className={styles.notificationPanel}>
        <div className={styles.notificationHeader}>
         <h3>Notifications</h3>
          <a className={styles.markAllRead} href="#">
            Mark all as read
          </a>
        </div>
        <div className={styles.notificationContentContainer}>
        <div className={styles.notificationSection}>
            {
                notificationsNew.length > 0  && <div className={styles.notificationCreateHeader}> <h4>New ({notificationsNew.length})</h4> <Link href='/notifications'><FaPlus fontSize={12}/> Create custom</Link></div>
            }
            {
                notificationsNew.map(notification=>{
                    return (
                        <div className={styles.notificationItem} onClick={()=>markAsRead(notification._id)}>
                        <div className={styles.notificationContent}>
                            <div>
                          <h5>
                            {notification.title}
                          </h5>
                          <p className={styles.notificationDescription}>
                            {truncateText(notification.description,30)}
                          </p>
                          </div>
                          <time className={styles.notificationTime}>{DateTime.fromISO(notification.createdAt).toRelative()}</time>
                        </div>
                      </div>
                    )
                })
            }
        </div>
        <div className={`${styles.notificationSection} ${styles.dismissed}`}>
        {
                notificationsPrev.length > 0  && <h4>Previous ({notificationsPrev.length})</h4>
            }
            {
                notificationsPrev.map(notification=>{
                    return (
                        <div className={styles.notificationItem}>
                        <div className={styles.notificationContent}>
                            <div>
                          <h5>
                            {notification.title}
                          </h5>
                          {
                            notification.data ? <a href={notification.data}>
                            {notification.description}
                          </a>:<p className={styles.notificationDescription}>
                            {notification.description}
                          </p>
                          }
                          
                          </div>
                          <time className={styles.notificationTime}>2 mins</time>
                        </div>
                      </div>
                    )
                })
            }
        </div>
        </div>
      </div>
    )
}