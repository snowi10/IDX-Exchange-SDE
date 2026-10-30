import styles from './Pagination.module.css';

export function Pagination({ onPrevClick, onNextClick, currentPage, firstPropertyNum, lastPropertyNum, totalProperties }) {
    const pageNumber = currentPage + 1;
    let prevButtonStyle = styles.pagination_button;
    let nextButtonStyle = styles.pagination_button;
    

    // Disable prev and next buttons when there are no more pages.
    if (firstPropertyNum === 1) {
        prevButtonStyle = styles.pagination_button_disabled;
    }
    if (lastPropertyNum + 1 > totalProperties) {
        nextButtonStyle = styles.pagination_button_disabled;
    }

    return (
        <div className={styles.pagination_grid}>
            <div className={styles.prev_div}>
                <button className={prevButtonStyle} type="button" onClick={() => onPrevClick()}>prev</button>
            </div>
            <div className={styles.pages_div}>
                <p>{pageNumber}...</p>
            </div>
            <div className={styles.next_div}>
                <button className={nextButtonStyle} type="button" onClick={() => onNextClick()}>next</button>
            </div>
        </div>
   ) 
}