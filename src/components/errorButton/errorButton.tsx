import { Component } from 'react';
import styles from './errorButton.module.css';

type State = {
  shouldThrowError: boolean;
};

class ErrorButton extends Component<object, State> {
  state: State = {
    shouldThrowError: false,
  };

  handleClick = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('Test application error');
    }

    return (
      <button className={styles.button} onClick={this.handleClick}>
        Throw Error
      </button>
    );
  }
}

export default ErrorButton;
