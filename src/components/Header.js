import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'lodash/fp/compose';

import {
  changeTheme,
  setFormatedResult,
  saveSnippet,
  loadSnippet,
  reset,
  openSidebar,
  closeSidebar,
  deleteSnippet,
} from 'actions';
import { themes } from 'themes';

const snippetExists = ({ id }, snippets) => (
  !! snippets.find(snippet => snippet.id === id)
);

const getSnippetsButtonsFormProps = ({
  currentSnippet,
  snippets,
  handleSaveSnippet,
  handleNew,
  handleForkSnippet,
  handleLoadSnippet,
  handleDeleteSnippet,
}) => snippetExists(currentSnippet, snippets) ? [
  {
    name: 'Delete',
    onClick(){
      handleDeleteSnippet(currentSnippet.id);
      handleNew();
    },
    icon: 'delete'
  },{
    name: 'Fork',
    onClick() {
      const snippet = Object.assign({}, currentSnippet, {
        id: null,
      });
      handleLoadSnippet(snippet)
    },
    icon: 'source-fork',
  },
  { name: 'New', onClick: handleNew, icon: 'note-plus' }
] : [
  {
    name: 'Save',
    onClick() {
      const snippet = Object.assign({}, currentSnippet, {
        id: `${Math.random() * 1000000}`.replace('.','X'),
      });
      handleSaveSnippet(snippet);
    },
    icon: 'content-save'
  }
];

const Header = props => {
  const {
    snippetID,
    theme,
    formatedResult,
    isSidebarOpen,
    onChangeTheme,
    onToggleFormatedResult,
    openSidebar,
    closeSidebar,
    handleNew,
    currentSnippet,
    snippets,
    handleSaveSnippet,
  } = props;
  const themesOptions = themes.map((t) => <option key={t} value={t}>{t}</option>)
  const stylesheet = theme === 'default' ? null : <link rel="stylesheet" type="text/css" href={`themes/${theme}.css`} />;
  const formatedResultClasses = classnames('Header__button Header__button--icon', {active: formatedResult});
  const menuClasses = classnames('Header__button Header__button--icon', {active: isSidebarOpen});
  const snippetName = !snippetExists(currentSnippet, snippets)  ? (
    <div className="Header__unsaved">
      <i className="mdi mdi-alert" />
      unsaved
    </div>
  ) : (
    <div className="Header__snippet-name-wrapper">
      <input
        className="Header__snippet-name"
        type="text"
        placeholder="No name"
        value={currentSnippet.name}
        onChange={(e) => {
          const name = e.target.value;
          handleSaveSnippet(Object.assign({}, currentSnippet, { name }));
        }}
      />
    </div>
  );
  const onToggleSidebar = isSidebarOpen ? closeSidebar : openSidebar;

  return (
    <header className="CodeMirror-gutters Header">
      {stylesheet}
      <div className="Header__section Header__section--primary">
        <button className={menuClasses} onClick={onToggleSidebar}>
          <i className="mdi mdi-menu" />
        </button>
        { getSnippetsButtonsFormProps(props).map(({ name, onClick, icon }) => (
          <button key={name} className="Header__button" onClick={onClick}>
            <i className={`mdi mdi-${icon}`} />
            {name}
          </button>
        )) }
        { snippetName }
      </div>

      <div className="Header__section">
        <select className="Header__themes-select Header__button" value={theme} onChange={onChangeTheme}>{themesOptions}</select>

        <button className={formatedResultClasses} onClick={() => onToggleFormatedResult(!formatedResult)}>
          <i className="mdi mdi-code-braces" />
        </button>
      </div>
    </header>
  );
}

Header.displayName = 'Header';

const mapStateToProps = ({ currentSnippet, snippets, theme, formatedResult, isSidebarOpen }) => ({
  currentSnippet,
  snippets,
  theme,
  formatedResult,
  isSidebarOpen,
});
const mapDispatchToProps = (dispatch) => {
  const handleLoadSnippet = compose(dispatch, loadSnippet);
  return {
    handleLoadSnippet,
    onChangeTheme: (e) => dispatch(changeTheme(e.target.value)),
    onToggleFormatedResult: compose(dispatch, setFormatedResult),
    handleNew: compose(dispatch, reset),
    handleSaveSnippet(snippet) {
      dispatch(saveSnippet(snippet));
      handleLoadSnippet(snippet);
    },
    handleDeleteSnippet: compose(dispatch, deleteSnippet),
    openSidebar: compose(dispatch, openSidebar),
    closeSidebar: compose(dispatch, closeSidebar),
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(Header);
