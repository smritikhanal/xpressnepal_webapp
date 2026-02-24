describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.com')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });

    it('rejects emails with spaces', () => {
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('user@exam ple.com')).toBe(false);
    });
  });

  describe('Phone Number Validation', () => {
    const isValidPhone = (phone: string) => {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(phone);
    };

    it('validates correct phone numbers', () => {
      expect(isValidPhone('9812345678')).toBe(true);
      expect(isValidPhone('+977-9812345678')).toBe(true);
      expect(isValidPhone('981 234 5678')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
    });
  });

  describe('Password Strength Validation', () => {
    const isStrongPassword = (password: string) => {
      return password.length >= 8;
    };

    it('validates strong passwords', () => {
      expect(isStrongPassword('password123')).toBe(true);
      expect(isStrongPassword('P@ssw0rd!')).toBe(true);
      expect(isStrongPassword('12345678')).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(isStrongPassword('weak')).toBe(false);
      expect(isStrongPassword('pass')).toBe(false);
      expect(isStrongPassword('')).toBe(false);
    });
  });

  describe('Price Validation', () => {
    const isValidPrice = (price: number) => {
      return price > 0 && Number.isFinite(price);
    };

    it('validates positive prices', () => {
      expect(isValidPrice(100)).toBe(true);
      expect(isValidPrice(0.01)).toBe(true);
      expect(isValidPrice(999999)).toBe(true);
    });

    it('rejects invalid prices', () => {
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-10)).toBe(false);
      expect(isValidPrice(NaN)).toBe(false);
      expect(isValidPrice(Infinity)).toBe(false);
    });
  });

  describe('Stock Validation', () => {
    const isValidStock = (stock: number) => {
      return stock >= 0 && Number.isInteger(stock);
    };

    it('validates valid stock numbers', () => {
      expect(isValidStock(0)).toBe(true);
      expect(isValidStock(100)).toBe(true);
      expect(isValidStock(1000)).toBe(true);
    });

    it('rejects invalid stock numbers', () => {
      expect(isValidStock(-1)).toBe(false);
      expect(isValidStock(10.5)).toBe(false);
      expect(isValidStock(NaN)).toBe(false);
    });
  });

  describe('Required Field Validation', () => {
    const isRequired = (value: string | null | undefined) => {
      return value !== null && value !== undefined && value.trim().length > 0;
    };

    it('validates filled fields', () => {
      expect(isRequired('value')).toBe(true);
      expect(isRequired('  text  ')).toBe(true);
    });

    it('rejects empty fields', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('URL Validation', () => {
    const isValidURL = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    it('validates correct URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
      expect(isValidURL('https://example.com/path?query=1')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('example.com')).toBe(false);
      expect(isValidURL('')).toBe(false);
    });
  });

  describe('Coordinates Validation', () => {
    const isValidCoordinates = (lat: number, lng: number) => {
      return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    };

    it('validates correct coordinates', () => {
      expect(isValidCoordinates(27.7172, 85.3240)).toBe(true);
      expect(isValidCoordinates(0, 0)).toBe(true);
      expect(isValidCoordinates(-90, -180)).toBe(true);
      expect(isValidCoordinates(90, 180)).toBe(true);
    });

    it('rejects invalid coordinates', () => {
      expect(isValidCoordinates(91, 0)).toBe(false);
      expect(isValidCoordinates(0, 181)).toBe(false);
      expect(isValidCoordinates(-91, 0)).toBe(false);
      expect(isValidCoordinates(0, -181)).toBe(false);
    });
  });
});
