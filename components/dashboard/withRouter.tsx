// components/withRouter.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Define the type for the Component prop
type ComponentWithRouterProps = {
  router: ReturnType<typeof useRouter>;
};

const withRouter = <P extends object>(Component: React.ComponentType<P & ComponentWithRouterProps>) => {
  const WithRouterComponent = (props: P) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null; // or a loading spinner
    }

    return <Component {...props} router={router} />;
  };

  // Set a display name for the HOC
  WithRouterComponent.displayName = `withRouter(${Component.displayName || Component.name || 'Component'})`;

  return WithRouterComponent;
};

export default withRouter;