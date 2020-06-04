import React from 'react'


const FallbackUI = () => {
  return (
    <div className="mobile-text text-red-600 bg-gray-900">
      <h1>An unexpected error occured</h1>
      <p>Kindly refresh your browser. If error persists please try again later.</p>
    </div>
  )
}

export default class ErrorBoundary extends React.Component<{}, { hasError: boolean}> {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <FallbackUI />
      }
  
      return this.props.children;
    }
  }

