/**
 * Class to handle pagination of a set of elements.
 */
export class Pagination {
  /**
   * Create an instance of Pagination.
   * @param {number} totalItems - The total number of items to be paged.
   * @param {number} itemsPerPage - The number of elements per page.
   */
  constructor(totalItems, itemsPerPage) {
    this.totalItems = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
  }

  /**
   * Gets the total number of pages.
   * @returns {number} - The total number of pages.
   */
  getTotalPages () {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  /**
   * Gets the current page.
   * @returns {number} - The number of the current page.
   */
  getCurrentPage () {
    return this.currentPage;
  }

  /**
   * Go to the next page if possible.
   */
  nextPage () {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  /**
   * Go back to the previous page if possible.
   */
  prevPage () {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Gets the starting index of the first element on the current page.
   * @returns {number} - The starting index of the first element on the current page.
   */
  getStartIndex () {
    return (this.currentPage - 1) * this.itemsPerPage;
  }
}
