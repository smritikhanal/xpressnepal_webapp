describe('Format Utilities', () => {
  describe('Price Formatting', () => {
    const formatPrice = (price: number, currency = 'NPR') => {
      return `${currency} ${price.toFixed(2)}`;
    };

    it('formats price with two decimal places', () => {
      expect(formatPrice(100)).toBe('NPR 100.00');
      expect(formatPrice(99.5)).toBe('NPR 99.50');
      expect(formatPrice(1234.567)).toBe('NPR 1234.57');
    });

    it('handles zero price', () => {
      expect(formatPrice(0)).toBe('NPR 0.00');
    });

    it('handles negative price', () => {
      expect(formatPrice(-50)).toBe('NPR -50.00');
    });

    it('supports different currencies', () => {
      expect(formatPrice(100, 'USD')).toBe('USD 100.00');
      expect(formatPrice(100, 'EUR')).toBe('EUR 100.00');
    });
  });

  describe('Date Formatting', () => {
    const formatDate = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString();
    };

    it('formats Date object', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('formats ISO date string', () => {
      const formatted = formatDate('2024-01-15T10:30:00Z');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('handles current date', () => {
      const formatted = formatDate(new Date());
      expect(formatted).toBeTruthy();
    });
  });

  describe('Number Formatting', () => {
    const formatNumber = (num: number) => {
      return num.toLocaleString();
    };

    it('formats large numbers with separators', () => {
      const formatted = formatNumber(1000000);
      expect(formatted).toContain('000');
    });

    it('handles small numbers', () => {
      expect(formatNumber(10)).toBeTruthy();
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('Percentage Formatting', () => {
    const formatPercentage = (value: number, total: number) => {
      if (total === 0) return '0%';
      return `${Math.round((value / total) * 100)}%`;
    };

    it('calculates percentage correctly', () => {
      expect(formatPercentage(25, 100)).toBe('25%');
      expect(formatPercentage(50, 200)).toBe('25%');
      expect(formatPercentage(75, 100)).toBe('75%');
    });

    it('handles zero total', () => {
      expect(formatPercentage(10, 0)).toBe('0%');
    });

    it('rounds to nearest integer', () => {
      expect(formatPercentage(33, 100)).toBe('33%');
      expect(formatPercentage(67, 100)).toBe('67%');
    });
  });

  describe('Text Truncation', () => {
    const truncate = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    it('truncates long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long ...');
    });

    it('does not truncate short text', () => {
      const shortText = 'Short';
      expect(truncate(shortText, 20)).toBe('Short');
    });

    it('handles exact length', () => {
      const text = 'Exactly twenty chars';
      expect(truncate(text, 20)).toBe('Exactly twenty chars');
    });
  });

  describe('Slug Generation', () => {
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    it('converts to lowercase', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('replaces spaces with hyphens', () => {
      expect(generateSlug('My Product Name')).toBe('my-product-name');
    });

    it('removes special characters', () => {
      expect(generateSlug('Product@123!')).toBe('product-123');
    });

    it('removes leading and trailing hyphens', () => {
      expect(generateSlug(' Product ')).toBe('product');
    });
  });

  describe('Phone Number Formatting', () => {
    const formatPhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
      return phone;
    };

    it('formats 10-digit phone number', () => {
      expect(formatPhone('9812345678')).toBe('981-234-5678');
    });

    it('handles phone with existing formatting', () => {
      expect(formatPhone('981-234-5678')).toBe('981-234-5678');
    });

    it('returns original if not 10 digits', () => {
      expect(formatPhone('12345')).toBe('12345');
    });
  });

  describe('Order Status Formatting', () => {
    const formatStatus = (status: string) => {
      return status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    it('capitalizes status', () => {
      expect(formatStatus('placed')).toBe('Placed');
      expect(formatStatus('confirmed')).toBe('Confirmed');
    });

    it('handles underscore-separated status', () => {
      expect(formatStatus('order_shipped')).toBe('Order Shipped');
      expect(formatStatus('payment_pending')).toBe('Payment Pending');
    });
  });
});
