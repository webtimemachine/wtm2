import { Pagination } from './Pagination';

describe('Pagination', () => {
  let pagination;

  beforeEach(() => {
    pagination = new Pagination(20, 5); // Create a new instance before each test
  });

  it('should return the correct number of pages', () => {
    expect(pagination.getTotalPages()).toBe(4);
  });

  it('should return the current page correctly', () => {
    expect(pagination.getCurrentPage()).toBe(1);
  });

  it('should increment current page correctly', () => {
    pagination.nextPage();
    expect(pagination.getCurrentPage()).toBe(2);
  });

  it('should decrement the current page correctly', () => {
    pagination.nextPage();
    pagination.prevPage();
    expect(pagination.getCurrentPage()).toBe(1);
  });

  it('should return the correct starting index', () => {
    expect(pagination.getStartIndex()).toBe(0);
  });

  it('should return correct initial index after page change', () => {
    pagination.nextPage();
    expect(pagination.getStartIndex()).toBe(5);
  });
});
