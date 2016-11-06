import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'lodash/fp/compose';

import {
  forkSnippet,
  loadSnippet,
} from 'actions';

const renderSnippet = (onClick, currentSnippet ) => snippet => {
  const { id, latest = '', name } = snippet;
  const className = classnames('Sidebar__snippet', {
    active: currentSnippet.id === id
  });
  return (
    <li className={className} key={id} onClick={onClick.bind(null, snippet)}>
      {name || latest.replace(/\n|\t/g,'').slice(0, 30)}
    </li>
  );
};

const Sidebar = ({ snippets, handleLoadSnippet, currentSnippet }) => {
  return (
    <aside className="Sidebar">
      <ul className="Sidebar__snippets">
        {snippets.map(renderSnippet(handleLoadSnippet, currentSnippet))}
      </ul>
    </aside>
  );
};

const mapStateToProps = ({ snippets, currentSnippet }) => ({
  currentSnippet,
  snippets,
});

const mapDispatchToProps = dispatch => ({
  handleLoadSnippet: compose(dispatch, loadSnippet),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
