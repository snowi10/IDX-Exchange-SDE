import styles from './Pagination.module.css';

/**
 * A component to move to different pages of the property listings.
 * @param {function} onPrevClick - To handle moving to the previous page.
 * @param {function} onNextClick - To handle moving to the next page.
 * @param {function} onPageClick - To handle moving to a specific page number.
 * @param {number} currentPage - The current page that the user is on.
 * @param {number} itemsPerPage - The number of properties that is shown on each page.
 * @param {number} firstPropertyNum - The number of the first property on the page.
 * @param {number} lastPropertyNum - The number of the last property on the page.
 * @param {number} totalProperties - The number of the last property on the page.
 */
export function Pagination({ onPrevClick, onNextClick, onPageClick, currentPage, itemsPerPage, firstPropertyNum, lastPropertyNum, totalProperties}) {
    let prevButtonStyle = styles.pagination_button;
    let nextButtonStyle = styles.pagination_button;

    // Create navigation buttons for the pages. 
    const pageButtons = createPageButtons(currentPage, totalProperties, itemsPerPage, onPageClick);

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

// TODO: Provide comments for this function and its helper functions.
/**
 * Create buttons for moving to different pages.
 * @param {number} currentPage - The current page that the user is on.
 * @param {number} totalProperties - The total number of properties in the list.
 * @param {number} itemsPerPage - The number of properties that is shown on each page.
 * @param {function} onPageClick - To handle clicking on a page button. 
 * @return an array of page buttons.
*/
function createPageButtons(currentPage, totalProperties, itemsPerPage, onPageClick) {
    const currentPageNumber = currentPage + 1;
    const numOfPages = Math.ceil(totalProperties/itemsPerPage);
    const numOfPageButtons = 9;
    const pageButtonsOffset = Math.floor(numOfPageButtons/2);
    let pageButtonsBuilder = []; 

    // Format page buttons for property listings with more than 6 pages.
    if (numOfPages > 6) {
        const startPage = calculateStartPage(currentPageNumber, numOfPages, numOfPageButtons, pageButtonsOffset);
        const endPage = calculateEndPage(currentPageNumber, numOfPages, numOfPageButtons, pageButtonsOffset);

        formatFirstPageButton(startPage, currentPageNumber, pageButtonsBuilder, onPageClick);
        
        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== numOfPages) {
                const colorStyle = setOnPageColor(currentPageNumber, i);
                pageButtonsBuilder.push(<p key={i} style={{display: 'inline'}}><button style={colorStyle} className={styles.page_button} type="button" value={i} onClick={(e) => onPageClick(e)}>{i}</button></p>)
            }
        }

        formatLastPageButton(currentPageNumber, endPage, numOfPages, pageButtonsBuilder, onPageClick);
    }
    // Format page buttons for property listings with 6 or less pages.
    else {
        for (let i = 0; i < numOfPages; i++) {
            const pageNumber = i + 1;
            const colorStyle = setOnPageColor(currentPageNumber, pageNumber);
            pageButtonsBuilder.push(<p key={pageNumber} style={{display: 'inline'}}><button style={colorStyle} className={styles.page_button} type="button" value={pageNumber} onClick={(e) => onPageClick(e)}>{pageNumber}</button></p>)
        }
    }

    return pageButtonsBuilder;
}

function calculateStartPage(currentPageNumber, numOfPages, numOfPageButtons, pageButtonsOffset) {
    if (numOfPageButtons > numOfPages) {
        return 1;
    }
    
    if (currentPageNumber > numOfPageButtons - pageButtonsOffset && currentPageNumber > numOfPages - pageButtonsOffset) {
        return numOfPages - numOfPageButtons;
    }

    if (currentPageNumber > numOfPageButtons - pageButtonsOffset) {
        return currentPageNumber - pageButtonsOffset;
    }
    
    return 1;
}

function calculateEndPage(currentPageNumber, numOfPages, numOfPageButtons, pageButtonsOffset) {
    if (numOfPageButtons > numOfPages) {
        return numOfPages;
    }

    if (currentPageNumber > numOfPageButtons - pageButtonsOffset && currentPageNumber + pageButtonsOffset < numOfPages) {
        return currentPageNumber + pageButtonsOffset;
    }

    if (currentPageNumber > numOfPageButtons - pageButtonsOffset) {
        return numOfPages;
    }

    return numOfPageButtons;
}

function formatFirstPageButton(startCurrentPages, currentPageNumber, pageButtonsBuilder, onPageClick) {
    const colorStyle = setOnPageColor(currentPageNumber, 1);

    // Add an ellipsis if the current page is not immediately after the first page.
     if (startCurrentPages > 2) {
        pageButtonsBuilder.push(<p key={1} style={{display: 'inline'}}><button className={styles.page_button} type="button" value={1} onClick={(e) => onPageClick(e)}>1</button>...</p>)
    }
    else {
        pageButtonsBuilder.push(<p key={1} style={{display: 'inline'}}><button style={colorStyle} className={styles.page_button} type="button" value={1} onClick={(e) => onPageClick(e)}>1</button></p>)
    }
}

function formatLastPageButton(currentPageNumber, endCurrentPages, numOfPages, pageButtonsBuilder, onPageClick) {
    const colorStyle = setOnPageColor(currentPageNumber, numOfPages);

    // Add an ellipsis if the current page is not immediately after the last page.
    if (endCurrentPages < numOfPages - 1 ) {
        pageButtonsBuilder.push(<p key={numOfPages} style={{display: 'inline'}}>...<button className={styles.page_button} type="button" value={numOfPages} onClick={(e) => onPageClick(e)}>{numOfPages}</button></p>)
    } 
    else {
        pageButtonsBuilder.push(<p key={numOfPages} style={{display: 'inline'}}><button style={colorStyle} className={styles.page_button} type="button" value={numOfPages} onClick={(e) => onPageClick(e)}>{numOfPages}</button></p>)
    }
}

function setOnPageColor(currentPageNumber, presentPageNumber) {
    if (currentPageNumber === presentPageNumber) {
        return {color: 'lightgrey', cursor: 'default'};
    }

    return {};
}