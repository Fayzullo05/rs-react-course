import { Component } from 'react';
import Search from '../search/search';
import Results from '../results/results';
import styles from './layout.module.css';

type State = {
  searchTerm: string;
};

class Layout extends Component<object, State> {
  state: State = {
    searchTerm: '',
  };

  componentDidMount() {
    const saved = localStorage.getItem('searchTerm');

    if (saved) {
      this.setState({ searchTerm: saved });
    }
  }

  handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === this.state.searchTerm) return;

    this.setState({ searchTerm: trimmed });
    localStorage.setItem('searchTerm', trimmed);
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <Search value={this.state.searchTerm} onSearch={this.handleSearch} />

        <Results searchTerm={this.state.searchTerm} />
      </div>
    );
  }
}

export default Layout;
