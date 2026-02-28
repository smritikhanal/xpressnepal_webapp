# Test Organization Guide

This project uses a clear separation between **Unit Tests** and **Integration Tests** to ensure comprehensive test coverage while maintaining test speed and reliability.

## 📋 Test Types

### Unit Tests
**Location:** `__tests__/` (excluding `__tests__/integration/`)

**Purpose:** Test individual functions, components, and modules in isolation.

**Characteristics:**
- ⚡ Fast execution (< 100ms per test)
- 🎯 Test single responsibility
- 🔌 Mock all external dependencies
- 🚫 No real API calls
- 🚫 No database interactions
- ✅ High number of tests

**Examples:**
- `__tests__/utils/format.test.ts` - Pure function tests
- `__tests__/lib/utils.test.ts` - Utility function tests
- `__tests__/components/notification-bell.test.tsx` - Component rendering tests
- `__tests__/store/auth-store.test.ts` - State management tests

### Integration Tests
**Location:** `__tests__/integration/` OR files ending with `.integration.test.ts`

**Purpose:** Test how multiple components/modules work together.

**Characteristics:**
- 🐢 Slower execution (acceptable > 1s per test)
- 🔗 Test component interactions
- 🌐 Can make real API calls
- 💾 Can test database interactions
- 🎭 Test end-to-end user flows
- ✅ Fewer but comprehensive tests

**Examples:**
- `__tests__/integration/auth-flow.integration.test.ts` - Complete login/logout flow
- `__tests__/integration/cart-checkout.integration.test.ts` - Cart to checkout process
- `__tests__/integration/order-lifecycle.integration.test.ts` - Order creation to delivery

## 🚀 Running Tests

### Run All Passing Tests (Unit Tests Only - Default)
```bash
npm test
```

### Run All Tests (Including Integration Tests)
```bash
npm run test:all
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode
```bash
# Watch all tests
npm run test:watch

# Watch unit tests only
npm run test:unit:watch

# Watch integration tests only
npm run test:integration:watch
```

### Coverage Reports
```bash
# Coverage for all tests
npm run test:coverage

# Coverage for unit tests only
npm run test:unit:coverage

# Coverage for integration tests only
npm run test:integration:coverage
```

### Run Both Types Sequentially
```bash
npm run test:all
```

## 📁 File Naming Conventions

### Unit Tests
```
__tests__/
  ├── components/
  │   └── notification-bell.test.tsx
  ├── lib/
  │   ├── utils.test.ts
  │   └── api-client.test.ts
  ├── store/
  │   ├── auth-store.test.ts
  │   └── cart-store.test.ts
  └── utils/
      ├── format.test.ts
      └── validation.test.ts
```

### Integration Tests
Option 1: Dedicated folder
```
__tests__/
  └── integration/
      ├── auth-flow.integration.test.ts
      ├── cart-checkout.integration.test.ts
      └── order-lifecycle.integration.test.ts
```

Option 2: .integration suffix
```
__tests__/
  └── features/
      ├── auth.integration.test.ts
      └── checkout.integration.test.ts
```

## 🎯 Best Practices

### Unit Tests Should:
- ✅ Test one thing at a time
- ✅ Be independent of each other
- ✅ Run in any order
- ✅ Use `jest.mock()` for external dependencies
- ✅ Have clear, descriptive test names
- ✅ Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests Should:
- ✅ Test realistic user scenarios
- ✅ Test multiple components working together
- ✅ Validate API contracts
- ✅ Test error handling across boundaries
- ✅ Include setup and teardown for test data
- ✅ Be idempotent (can run multiple times)

## 📝 Example Test Structure

### Unit Test Example
```typescript
// __tests__/utils/format.test.ts
describe('Format Utilities', () => {
  describe('formatPrice', () => {
    it('formats price with two decimal places', () => {
      expect(formatPrice(100)).toBe('NPR 100.00');
    });

    it('handles zero price', () => {
      expect(formatPrice(0)).toBe('NPR 0.00');
    });
  });
});
```

### Integration Test Example
```typescript
// __tests__/integration/auth-flow.integration.test.ts
describe('Authentication Flow (Integration)', () => {
  it('should complete full login flow', async () => {
    // Arrange: Setup test data
    const credentials = { email: 'test@example.com', password: 'password123' };
    
    // Act: Perform login
    const response = await loginUser(credentials);
    
    // Assert: Verify complete flow
    expect(response.token).toBeDefined();
    expect(localStorage.getItem('token')).toBe(response.token);
    expect(response.user.email).toBe(credentials.email);
  });
});
```

## 🔧 Configuration Files

- `jest.config.ts` - Default configuration (all tests)
- `jest.config.unit.ts` - Unit tests only
- `jest.config.integration.ts` - Integration tests only

## 📊 Coverage Goals

| Test Type | Coverage Goal | Speed |
|-----------|--------------|-------|
| Unit Tests | 80%+ | < 100ms/test |
| Integration Tests | 60%+ | < 5s/test |
| Overall | 75%+ | N/A |

## 🤝 Contributing

When adding new tests:
1. Determine if it's a unit or integration test
2. Place it in the appropriate directory
3. Follow naming conventions
4. Ensure tests are isolated and repeatable
5. Add descriptive test names
6. Run both unit and integration tests before committing

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
