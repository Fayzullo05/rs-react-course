import { Component } from 'react';
import Search from '../search/search';
import Results from '../results/results';

class Layout extends Component {
  render() {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Search />
        </div>

        <div>
          <Results />
        </div>
      </div>
    );
  }
}

export default Layout;
