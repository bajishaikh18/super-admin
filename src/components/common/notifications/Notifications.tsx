import { truncateText } from '@/helpers/common';
import styles from './Notifications.module.scss';

const notificationsNew = [
    {
        dismissed: false,
        title: "Falcon Human Resource Consultancy",
        descriptions:"New Agency has been created"
    },
    {
        dismissed: false,
        title: "Jobs for Oman",
        descriptions:"New job post has been created"
    },
]

const notificationsPrev = [
    {
        dismissed: true,
        title: "New request for an Employer",
        data: "/posted-jobs",
        descriptions: "View Details"
    },
    {
        dismissed: true,
        title: "Report has been generated",
        descriptions:"New job post has been created"
    },
    {
        dismissed: true,
        title: "Report has been generated",
        descriptions:"New job post has been created"
    }
]
export const Notifications = ()=>{
    return (
        <div className={styles.notificationPanel}>
        <div className={styles.notificationHeader}>
         <h3> Notifications</h3>
          <a className={styles.markAllRead} href="#">
            Mark all as read
          </a>
        </div>
        <div className={styles.notificationContentContainer}>
        <div className={styles.notificationSection}>
            {
                notificationsNew.length > 0  && <h4>New ({notificationsNew.length})</h4>
            }
            {
                notificationsNew.map(notification=>{
                    return (
                        <div className={styles.notificationItem}>
                        <div className={styles.notificationContent}>
                            <div>
                          <h5>
                            {notification.title}
                          </h5>
                          <p className={styles.notificationDescription}>
                            {truncateText(notification.descriptions,30)}
                          </p>
                          </div>
                          <time className={styles.notificationTime}>2 mins</time>
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
                            {notification.descriptions}
                          </a>:<p className={styles.notificationDescription}>
                            {notification.descriptions}
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