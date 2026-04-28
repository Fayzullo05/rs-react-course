import { Component } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import styles from './search.module.css';

type Props = {
  value: string;
  onSearch: (value: string) => void;
};

type State = {
  inputValue: string;
};

class Search extends Component<Props, State> {
  state: State = {
    inputValue: this.props.value,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      this.setState({ inputValue: this.props.value });
    }
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearch = () => {
    this.props.onSearch(this.state.inputValue);
  };

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    const { inputValue } = this.state;
    const isDisabled = !inputValue.trim();

    return (
      <div className={styles.container}>
        <div className={styles.title}>Search</div>

        <div className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter search term..."
            value={inputValue}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />

          <button
            className={styles.button}
            onClick={this.handleSearch}
            disabled={isDisabled}
          >
            Search
          </button>
        </div>
      </div>
    );
  }
}

export default Search;
