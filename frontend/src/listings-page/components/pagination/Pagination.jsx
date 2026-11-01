import styles from './Pagination.module.css';

/**
 * A component to move to the previous or next page of property listings.
 * @param {function} onPrevClick - To handle moving to the previous page.
 * @param {function} onNextClick - To handle moving to the next page.
 * @param {number} firstPropertyNum - The number of the first property on the page.
 * @param {number} lastPropertyNum - The number of the last property on the page.
 * @param {number} totalProperties - The number of the last property on the page.
 * @param {array} pageButtons - A list of buttons for moving to different pages.
 */
export function Pagination({ onPrevClick, onNextClick, firstPropertyNum, lastPropertyNum, totalProperties, pageButtons }) {
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
                {pageButtons}
            </div>
            <div className={styles.next_div}>
                <button className={nextButtonStyle} type="button" onClick={() => onNextClick()}>next</button>
            </div>
        </div>
   ) 
}