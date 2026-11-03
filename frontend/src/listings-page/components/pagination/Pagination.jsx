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
 * @param {number} totalProperties - The number of total property listings.
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
    const numOfDynamicPageButtons = 9;
    const dynamicPageButtonsOffset = Math.floor(numOfDynamicPageButtons/2);
    let pageButtonsBuilder = []; 

    // Format page buttons for property listings with more than 6 pages.
    if (numOfPages > 6) {
        const dynamicPageButtonsStart = calculateStartPageButton(currentPageNumber, numOfPages, numOfDynamicPageButtons, dynamicPageButtonsOffset);
        const dynamicPageButtonsEnd = calculateEndPageButton(currentPageNumber, numOfPages, numOfDynamicPageButtons, dynamicPageButtonsOffset);

        // Button for the first page.
        formatFirstPageButton(currentPageNumber, dynamicPageButtonsStart, pageButtonsBuilder, onPageClick);
        
        // Create dynamic page buttons depending on the current page number that the user is on.
        for (let i = dynamicPageButtonsStart; i <= dynamicPageButtonsEnd; i++) {
            if (i !== 1 && i !== numOfPages) {
                const colorStyle = setOnPageColor(currentPageNumber, i);
                pageButtonsBuilder.push(<p key={i} style={{display: 'inline'}}><button style={colorStyle} className={styles.page_button} type="button" value={i} onClick={(e) => onPageClick(e)}>{i}</button></p>)
            }
        }

        // Button for the last page.
        formatLastPageButton(currentPageNumber, dynamicPageButtonsEnd, numOfPages, pageButtonsBuilder, onPageClick);
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

/**
 * Calculate the starting number of the dynamic page buttons.
 * @param {number} currentPageNumber - The current page number that the user is on.
 * @param {number} numOfPages - The number of pages that exist.
 * @param {number} numOfDynamicPageButtons - The number of dynamic page buttons.
 * @param {number} dynamicPageButtonsOffset - The offset number to manage how many dynamic page buttons to display on screen.
 * @returns a number for indicating the start of the dynamic page buttons.
 */
function calculateStartPageButton(currentPageNumber, numOfPages, numOfDynamicPageButtons, dynamicPageButtonsOffset) {
    // Return page number one if the number of dynamic page buttons to be displayed is greater
    // than the number of existing pages.
    if (numOfDynamicPageButtons > numOfPages) {
        return 1;
    }
    
    // Handle start page button near the end of the number of pages.
    if (currentPageNumber > numOfDynamicPageButtons - dynamicPageButtonsOffset && currentPageNumber > numOfPages - dynamicPageButtonsOffset) {
        return numOfPages - numOfDynamicPageButtons;
    }

    // Handle start page button near the middle of the number of pages.
    if (currentPageNumber > numOfDynamicPageButtons - dynamicPageButtonsOffset) {
        return currentPageNumber - dynamicPageButtonsOffset;
    }
    
    // Handle start page button near the beginning of the number of pages.
    return 1;
}

/**
 * Calculate the ending number of the dynamic page buttons.
 * @param {number} currentPageNumber - The current page number that the user is on.
 * @param {number} numOfPages - The number of pages that exist.
 * @param {number} numOfDynamicPageButtons - The number of dynamic page buttons.
 * @param {number} dynamicPageButtonsOffset - The offset number to manage how many dynamic page buttons to display on screen.
 * @returns a number for indicating the end of the dynamic page buttons. 
 */
function calculateEndPageButton(currentPageNumber, numOfPages, numOfDynamicPageButtons, dynamicPageButtonsOffset) {
    // Return the last page number if the number of dynamic page buttons to be displayed is greater
    // than the number of existing pages.
    if (numOfDynamicPageButtons > numOfPages) {
        return numOfPages;
    }

    // Handle end page button near the middle of the number of pages.
    if (currentPageNumber > numOfDynamicPageButtons - dynamicPageButtonsOffset && currentPageNumber + dynamicPageButtonsOffset < numOfPages) {
        return currentPageNumber + dynamicPageButtonsOffset;
    }

    // Handle end page button near the end of the number of pages.
    if (currentPageNumber > numOfDynamicPageButtons - dynamicPageButtonsOffset) {
        return numOfPages;
    }

    // Handle end page button near the beggining of the number of pages. 
    return numOfDynamicPageButtons;
}

/**
 * Format the first page button.
 * @param {number} currentPageNumber - The current page number that the user is on.
 * @param {number} dynamicPageButtonsStart - The start number of the dynamic page buttons.
 * @param {array} pageButtonsBuilder - The array containing the dynamic page buttons.
 * @param {function} onPageClick - To handle clicking on the page button. 
 */
function formatFirstPageButton(currentPageNumber, dynamicPageButtonsStart, pageButtonsBuilder, onPageClick) {
    const colorStyle = setOnPageColor(currentPageNumber, 1);

    // Add an ellipsis if the start page number of the dynamic buttons is not immediately after the first page.
     if (dynamicPageButtonsStart > 2) {
        pageButtonsBuilder.push(<p key={1} style={{display: 'inline'}}><button className={styles.page_button} type="button" value={1} onClick={(e) => onPageClick(e)}>1</button>...</p>)
    }
    else {
        pageButtonsBuilder.push(<p key={1} style={{display: 'inline'}}><button style={colorStyle} className={styles.page_button} type="button" value={1} onClick={(e) => onPageClick(e)}>1</button></p>)
    }
}

/**
 * Format the last page button.
 * @param {number} currentPageNumber - The current page number that the user is on.
 * @param {number} dynamicPageButtonsEnd - The end number of the dynamic page buttons.
 * @param {number} numOfPages - The number of the last page.
 * @param {array} pageButtonsBuilder - The array containing the dynamic page buttons.
 * @param {function} onPageClick - To handle clicking on the page button. 
 */
function formatLastPageButton(currentPageNumber, dynamicPageButtonsEnd, numOfPages, pageButtonsBuilder, onPageClick) {
    const colorStyle = setOnPageColor(currentPageNumber, numOfPages);

    // Add an ellipsis if the end page number of the dynamic buttons is not immediately after the last page.
    if (dynamicPageButtonsEnd < numOfPages - 1 ) {
        pageButtonsBuilder.push(<p key={numOfPages} style={{display: 'inline'}}>...<button className={styles.page_button} type="button" value={numOfPages} onClick={(e) => onPageClick(e)}>{numOfPages}</button></p>)
    } 
    else {
        pageButtonsBuilder.push(<p key={numOfPages} style={{display: 'inline'}}><button style={colorStyle} className={styles.page_button} type="button" value={numOfPages} onClick={(e) => onPageClick(e)}>{numOfPages}</button></p>)
    }
}

/**
 * Change the color of the page button depending on whether the user is on it or not.
 * @param {number} currentPageNumber - The current page number that the user is on.
 * @param {number} presentPageNumber - The page number that is currently being created.
 * @returns an object for styling the page button.
 */
function setOnPageColor(currentPageNumber, presentPageNumber) {
    // Change the color of the page button to lightgrey if the user is currently on it.
    if (currentPageNumber === presentPageNumber) {
        return {color: 'lightgrey', cursor: 'default'};
    }

    return {};
}