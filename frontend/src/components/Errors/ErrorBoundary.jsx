import { Component } from "react";

/**
 * Catches render-time crashes anywhere below it. Without one, a single thrown
 * error unmounts the whole tree and the user is left looking at a blank page.
 *
 * Must be a class: there is no hook equivalent of componentDidCatch.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info);
  }

  handleReload = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-sm w-full">
          <div className="card-body items-center text-center gap-4">
            <span className="text-5xl" role="img" aria-label="Startled cat">
              🙀
            </span>
            <h1 className="card-title">Something went wrong</h1>
            <p className="text-sm opacity-70">
              The cats knocked something off the table. Reloading usually fixes it.
            </p>
            <button type="button" className="btn btn-primary btn-sm" onClick={this.handleReload}>
              Back to safety
            </button>
          </div>
        </div>
      </div>
    );
  }
}
