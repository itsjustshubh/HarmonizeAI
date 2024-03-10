import React, { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false, error: null, errorInfo: null };

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops, something went wrong!</h2>
                        <details className="text-gray-600">
                            <summary className="font-medium underline cursor-pointer">
                                Click here to view error details
                            </summary>
                            <div className="whitespace-pre-wrap mt-2">
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </div>
                        </details>
                    </div>
                </div>
            );
        }

        // Normally, just render children
        return this.props.children;
    }
}

export default ErrorBoundary;
