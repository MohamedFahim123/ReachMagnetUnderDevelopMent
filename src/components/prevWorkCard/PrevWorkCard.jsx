import { useNavigate } from 'react-router-dom';
import styles from './prevWorkCard.module.css';

export default function PrevWorkCard({ page, handleDeleteThisPrevWork, img, id, title, description, type }) {
    const navigate = useNavigate();
    return (
        <div
            className={styles.card}
            style={{minHeight: '450px'}}
        >
            <img
                className={styles.image} src={img} alt={`${title}`}
            />
            <div className='d-flex flex-column px-2 w-100 gap-1'>
                <h3
                    className={styles.title}
                >{title}</h3>
                <p className={styles.type}><span>Type:</span> {type}</p>
                <p className={styles.description}>{description}</p>
            </div>
            {
                page !== 'singleCompany' &&
                <div className='w-100 d-flex justify-content-end gap-3'>
                    <button
                        className={`${styles.button} btn btn-outline-primary px-4 d-flex justify-content-center align-items-center gap-2`}
                        onClick={() => navigate(`/profile/previous-work/edit-item/${id}`)}
                    ><i className={`bi bi-pencil-square text-primary ${styles.icon}`}></i></button>
                    <button
                        className={`${styles.button} btn btn-outline-danger px-4 d-flex justify-content-center align-items-center gap-2`}
                        onClick={() => handleDeleteThisPrevWork(id)}
                    ><i className={`bi bi-trash text-danger ${styles.icon}`}></i></button>
                </div>
            }
        </div>
    )
}
