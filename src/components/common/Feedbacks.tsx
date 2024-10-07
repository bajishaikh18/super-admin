import styles from "./Feedbacks.module.scss";
type sizes = 'sm'|'md'|'lg';
export const Loader = ({ text,size,textSize }: { text?: string,size?:sizes,textSize?: sizes}) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={`spinner black ${styles[size || "md"]}`}></div>
      {
        text && <h3 className={styles[textSize||"md"]}>{text}</h3>
      }
    </div>
  );
};

export const NotFound = ({ text,textSize }: { text?: string,textSize?: sizes}) => {
  return (
    <div className={styles.loadingContainer}>
      <h3 className={styles[textSize||"md"]}>{text}</h3>
      
    </div>
  );
};
