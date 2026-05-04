import { Component } from 'react';
import Search from '../search/search';
import Results from '../results/results';
import type { Person } from '../../types/person';
import ErrorButton from '../errorButton/errorButton';
import styles from './layout.module.css';

type State = {
  searchTerm: string;
  results: Person[];
  loading: boolean;
  error: string | null;
};

type PeopleResponse = {
  results: Person[];
};

class Layout extends Component<object, State> {
  state: State = {
    searchTerm: '',
    results: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    const saved = localStorage.getItem('searchTerm') || '';

    this.setState({ searchTerm: saved }, () => {
      this.fetchData(saved);
    });
  }

  fetchData = async (term: string) => {
    this.setState({ loading: true, error: null });

    try {
      const url = term
        ? `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(
            term
          )}`
        : 'https://rickandmortyapi.com/api/character/';

      const res = await fetch(url);

      if (res.status === 404) {
        this.setState({
          results: [],
          loading: false,
        });
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = (await res.json()) as PeopleResponse;

      this.setState({
        results: data.results,
        loading: false,
      });
    } catch {
      this.setState({
        results: [],
        error:
          'Failed to load results. Please check your connection or try again later.',
        loading: false,
      });
    }
  };

  handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === this.state.searchTerm) return;

    localStorage.setItem('searchTerm', trimmed);

    this.setState({ searchTerm: trimmed }, () => this.fetchData(trimmed));
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <Search value={this.state.searchTerm} onSearch={this.handleSearch} />

        <Results
          results={this.state.results}
          loading={this.state.loading}
          error={this.state.error}
        />

        <ErrorButton />
      </div>
    );
  }
}

export default Layout;
