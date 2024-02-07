export class Pagination {
  constructor(totalItems, itemsPerPage) {
    this.totalItems = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
  }

  getTotalPages () {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getCurrentPage () {
    return this.currentPage;
  }

  nextPage () {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  prevPage () {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getStartIndex () {
    return (this.currentPage - 1) * this.itemsPerPage;
  }
}
