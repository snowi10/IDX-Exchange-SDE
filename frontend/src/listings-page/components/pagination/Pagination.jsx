import styles from './Pagination.module.css';

export function Pagination({ onPrevClick, onNextClick, currentPage, itemsPerPage, firstPropertyNum, lastPropertyNum, totalProperties }) {
    const pageNumber = currentPage + 1;
    let prevButtonStyle = styles.pagination_button;
    let nextButtonStyle = styles.pagination_button;
    let pageButtons = [];

    if (Math.ceil(totalProperties/itemsPerPage) > 4) {

        // TODO: Display page buttons in groups of 4.

        for (let i = 0; i < 4; i++) {
            let page = i + 1;

            if (i === 0) {
                pageButtons.push(<p style={{display: 'inline'}} key={page}><button>{page}</button>...</p>);
            }
            else {
                pageButtons.push(<p style={{display: 'inline'}} key={page}><button>{page}</button></p>)
            }
        }
    }
    else {
        const numberOfPages = Math.ceil(totalProperties/itemsPerPage);
        for (let i = 0; i < numberOfPages; i++) {
            let page = i + 1;
            pageButtons.push(<p style={{display: 'inline'}}><button key={page}>{page}</button></p>);
        }
    }


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