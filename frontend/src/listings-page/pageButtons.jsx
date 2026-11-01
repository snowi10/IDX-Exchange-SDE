import styles from './ListingsPage.module.css';

// TODO: There is probably a more optimized way to create this function.
/**
 * Create buttons for moving to different pages.
 * @param {number} currentPage - The current page that the user is on.
 * @param {number} totalProperties - The total number of properties in the list.
 * @param {number} itemsPerPage - The number of properties that is shown on each page.
 * @param {function} onPageClick - To handle clicking on a page button. 
 * @return a list of page buttons.
 */
export function createPageButtons(currentPage, totalProperties, itemsPerPage, onPageClick) {
    const currentPageNumber = currentPage + 1;
    const numOfPages = Math.ceil(totalProperties/itemsPerPage);
    const middlePage = Math.ceil(numOfPages/2); // Actual middle page.
    const prevMiddlePage = middlePage - 1; // The page before the middle page.
    const nextMiddlePage = middlePage + 1; // The page after the middle page.
    let pageButtonsBuilder = []; 

    // Format page buttons for property listings with more than 6 pages.
    if (numOfPages > 6) {
        formatFirstPageButton(currentPageNumber, pageButtonsBuilder, onPageClick);
        formatMiddlePageButtons(currentPageNumber, prevMiddlePage, middlePage, nextMiddlePage, pageButtonsBuilder, onPageClick);
        formatLastPageButton(currentPageNumber, nextMiddlePage, numOfPages, pageButtonsBuilder, onPageClick);
        formatCurrentPageButton(currentPageNumber, prevMiddlePage, nextMiddlePage, numOfPages, pageButtonsBuilder, onPageClick);
    }
    // Format page buttons for property listings with 6 or less pages.
    else {
        for (let i = 0; i < numOfPages; i++) {
            pageButtonsBuilder.push(<p key={i+1} style={{display: 'inline'}}><button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>{i+1}</button></p>)
        }
    }

    return pageButtonsBuilder;
}

function formatFirstPageButton(currentPageNumber, pageButtonsBuilder, onPageClick) {
    // Add an ellipsis if the current page is not immediately after the first page.
     if (currentPageNumber === 1 || currentPageNumber !== 2) {
        pageButtonsBuilder.push(<p key={1} style={{display: 'inline'}}><button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>1</button>...</p>)
    }
    else {
        pageButtonsBuilder.push(<p key={1} style={{display: 'inline'}}><button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>1</button></p>)
    }
}

function formatMiddlePageButtons(currentPageNumber, prevMiddlePage, middlePage, nextMiddlePage, pageButtonsBuilder, onPageClick) {
    // Add an ellipsis if the current page is not immediately before prevMiddlePage.
    if (currentPageNumber > 1 && currentPageNumber < prevMiddlePage - 1) {
        pageButtonsBuilder.push(<p key={prevMiddlePage} style={{display: 'inline'}}>...<button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>{prevMiddlePage}</button></p>)
    }
    else {
        pageButtonsBuilder.push(<p key={prevMiddlePage} style={{display: 'inline'}}><button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>{prevMiddlePage}</button></p>)
    }

    pageButtonsBuilder.push(<p key={middlePage} style={{display: 'inline'}}><button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>{middlePage}</button></p>)

    // Remove the ellipsis if the current page is not immediately after nextMiddlePage.
    if (currentPageNumber > nextMiddlePage && currentPageNumber === nextMiddlePage + 1) {
        pageButtonsBuilder.push(<p key={nextMiddlePage} style={{display: 'inline'}}><button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>{nextMiddlePage}</button></p>)
    }
    else {
        pageButtonsBuilder.push(<p key={nextMiddlePage} style={{display: 'inline'}}><button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>{nextMiddlePage}</button>...</p>)
    }
}

function formatLastPageButton(currentPageNumber, nextMiddlePage, numOfPages, pageButtonsBuilder, onPageClick) {
    // Add an ellipsis if the current page is not immediately after the last page.
    if (currentPageNumber > nextMiddlePage && currentPageNumber < numOfPages - 1 ) {
        pageButtonsBuilder.push(<p key={numOfPages} style={{display: 'inline'}}>...<button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>{numOfPages}</button></p>)
    } 
    else {
        pageButtonsBuilder.push(<p key={numOfPages} style={{display: 'inline'}}><button className={styles.page_button} type="button" onClick={(e) => onPageClick(e)}>{numOfPages}</button></p>)
    }
}

function formatCurrentPageButton(currentPageNumber, prevMiddlePage, nextMiddlePage, numOfPages, pageButtonsBuilder, onPageClick) {
    // Add the current page button between the first page button and the middle page buttons.
    if (currentPageNumber > 1 && currentPageNumber < prevMiddlePage) {
        pageButtonsBuilder.splice(1, 0, <p key={currentPageNumber} style={{display: 'inline'}}><button className={styles.page_button}type="button" onClick={(e) => onPageClick(e)}>{currentPageNumber}</button></p>)
    }
    // Add the current page button between the middle page buttons and the last page button.
    else if (currentPageNumber > nextMiddlePage && currentPageNumber < numOfPages) {
        pageButtonsBuilder.splice(4, 0, <p key={currentPageNumber} style={{display: 'inline'}}><button className={styles.page_button}type="button" onClick={(e) => onPageClick(e)}>{currentPageNumber}</button></p>)
    }
}