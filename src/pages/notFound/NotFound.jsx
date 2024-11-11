import styles from './notFound.module.css';
import notFoundImg from './404-not-found.png';
export default function NotFound() {
  return (
    <div className={styles.notFound__handler}>
      <img src={notFoundImg} alt="not found page" />
    </div>
  );
};
