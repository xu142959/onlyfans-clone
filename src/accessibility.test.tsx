import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import axe from 'axe-core';

// 模拟 ResizeObserver
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    constructor(callback: ResizeObserverCallback) {}
    observe(target: Element) {}
    unobserve(target: Element) {}
    disconnect() {}
  };
}

import { LoginForm } from './app/components/LoginForm';
import { RegisterForm } from './app/components/RegisterForm';
import { HomePage } from './app/pages/HomePage';
import { ProfilePage } from './app/pages/ProfilePage';
import { AuthContext } from './app/context/AuthContext.tsx';

// 自定义匹配器
function toHaveNoViolations(received: axe.AxeResults) {
  const violations = received.violations;
  const pass = violations.length === 0;
  
  if (pass) {
    return {
      message: () => 'Expected no accessibility violations',
      pass: true,
    };
  } else {
    const violationMessages = violations.map((violation) => {
      return `${violation.id}: ${violation.description}\n  Elements: ${violation.nodes.map((node) => node.target).join(', ')}`;
    }).join('\n\n');
    
    return {
      message: () => `Expected no accessibility violations, but found:\n\n${violationMessages}`,
      pass: false,
    };
  }
}

// 扩展expect匹配器
expect.extend({ toHaveNoViolations });



// 模拟AuthProvider
const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockAuthValue = {
    user: null,
    ageVerified: false,
    isLoading: false,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    verifyAge: () => {},
    switchToCreator: async () => {}
  };

  return (
    <AuthContext.Provider value={mockAuthValue}>
      <div>{children}</div>
    </AuthContext.Provider>
  );
};

// 测试登录表单的可访问性
describe('Accessibility Tests', () => {
  test('LoginForm should have no accessibility violations', async () => {
    const { container } = render(
      <LoginForm
        onLogin={() => {}}
        onSwitchToRegister={() => {}}
      />
    );

    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  test('RegisterForm should have no accessibility violations', async () => {
    const { container } = render(
      <RegisterForm
        onRegister={() => {}}
        onSwitchToLogin={() => {}}
      />
    );

    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  test('HomePage should have no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <MockAuthProvider>
          <HomePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  test('ProfilePage should have no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <MockAuthProvider>
          <ProfilePage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
