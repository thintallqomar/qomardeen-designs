import { Component, type ReactNode } from 'react';
import HeroInteractive from './HeroInteractive';
import HeroLegacy from './HeroLegacy';

interface ErrorBoundaryState {
  hasError: boolean;
}

class HeroErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <HeroLegacy />;
    }
    return this.props.children;
  }
}

const Hero = () => (
  <HeroErrorBoundary>
    <HeroInteractive />
  </HeroErrorBoundary>
);

export default Hero;
