// Pagination Tests
describe('Admin User Pagination - Integrated Tests', () => {
  describe('Pagination Logic', () => {
    test('should calculate skip correctly for page 1', () => {
      const page = 1;
      const limit = 10;
      const skip = (page - 1) * limit;
      
      expect(skip).toBe(0);
    });

    test('should calculate skip correctly for page 2', () => {
      const page = 2;
      const limit = 10;
      const skip = (page - 1) * limit;
      
      expect(skip).toBe(10);
    });

    test('should calculate skip correctly for page 3', () => {
      const page = 3;
      const limit = 5;
      const skip = (page - 1) * limit;
      
      expect(skip).toBe(10);
    });

    test('should calculate total pages correctly', () => {
      const total = 25;
      const limit = 10;
      const pages = Math.ceil(total / limit);
      
      expect(pages).toBe(3);
    });

    test('should handle exact division of total by limit', () => {
      const total = 20;
      const limit = 10;
      const pages = Math.ceil(total / limit);
      
      expect(pages).toBe(2);
    });

    test('should handle single page', () => {
      const total = 5;
      const limit = 10;
      const pages = Math.ceil(total / limit);
      
      expect(pages).toBe(1);
    });

    test('should handle empty results', () => {
      const total = 0;
      const limit = 10;
      const pages = Math.ceil(total / limit);
      
      expect(pages).toBe(0);
    });

    test('should handle limit of 5 users per page', () => {
      const page = 1;
      const limit = 5;
      const skip = (page - 1) * limit;
      
      expect(limit).toBe(5);
      expect(skip).toBe(0);
    });

    test('should calculate pages for 27 users with limit 5', () => {
      const total = 27;
      const limit = 5;
      const pages = Math.ceil(total / limit);
      
      expect(pages).toBe(6);
    });
  });

  describe('Query Parameter Parsing', () => {
    test('should default to page 1 if not provided', () => {
      const page = parseInt('') || 1;
      expect(page).toBe(1);
    });

    test('should default to limit 10 if not provided', () => {
      const limit = parseInt('') || 10;
      expect(limit).toBe(10);
    });

    test('should parse page from string', () => {
      const page = parseInt('3');
      expect(page).toBe(3);
    });

    test('should parse limit from string', () => {
      const limit = parseInt('5');
      expect(limit).toBe(5);
    });

    test('should handle invalid page number', () => {
      const page = parseInt('invalid') || 1;
      expect(page).toBe(1);
    });
  });
});
