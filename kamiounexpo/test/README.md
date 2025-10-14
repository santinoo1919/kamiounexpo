# Test Organization

This directory contains all tests for the Kamioun Expo app, organized by type and functionality.

## 📁 Directory Structure

```
test/
├── unit/                           # Unit tests (individual functions/components)
│   ├── logic/                      # Business logic tests
│   │   └── cartCalculations.test.ts
│   ├── context/                    # React Context tests
│   │   └── CartContext.test.tsx
│   ├── services/                   # Service layer tests
│   │   ├── apiProblem.test.ts
│   │   └── storage.test.ts
│   ├── components/                 # Component tests
│   │   └── Text.test.tsx
│   └── utils/                      # Utility function tests
│       └── i18n.test.ts
├── integration/                     # Integration tests (end-to-end flows)
├── setup.ts                        # Jest configuration
├── test-tsconfig.json              # TypeScript config for tests
└── README.md                       # This file
```

## 🧪 Test Categories

### **Unit Tests** (`test/unit/`)

- **Logic**: Business logic, calculations, data transformations
- **Context**: React Context state management
- **Services**: API calls, external service integrations
- **Components**: UI component rendering and behavior
- **Utils**: Helper functions, utilities

### **Integration Tests** (`test/integration/`)

- End-to-end user flows
- Component interactions
- API integration flows

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm test -- --testPathPattern="unit/logic"      # Business logic only
npm test -- --testPathPattern="unit/services"   # Services only
npm test -- --testPathPattern="unit/context"    # Context only

# Run specific test files
npm test -- --testPathPattern="cartCalculations"
npm test -- --testPathPattern="CartContext"
```

## 📝 Adding New Tests

1. **Choose the right category** based on what you're testing
2. **Follow the naming convention**: `*.test.ts` or `*.test.tsx`
3. **Update this README** if adding new categories
4. **Update the index file** in the relevant category

## 🎯 Test Philosophy

- **Test business logic** - Core app functionality
- **Test error handling** - Prevent crashes
- **Test data integrity** - Critical operations
- **Skip simple utilities** - Low-value tests
- **Focus on user impact** - What affects the user experience

## ✅ Current Coverage

- **Business Logic**: 100% (Cart calculations)
- **State Management**: 100% (Cart context)
- **API Services**: 100% (Error handling)
- **Storage**: 100% (Data persistence)
- **i18n**: 100% (Translation validation)
- **Components**: 10% (Basic Text component)
