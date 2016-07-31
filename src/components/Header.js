import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'lodash/fp/compose';

import { changeTheme, setFormatedResult } from 'actions';
import { themes } from 'themes';

const Header = ({ theme, formatedResult, onChangeTheme, onToggleFormatedResult}) => {
  const themesOptions = themes.map((t) => <option key={t} value={t}>{t}</option>)
  const stylesheet = theme === 'default' ? null : <link rel="stylesheet" type="text/css" href={`themes/${theme}.css`} />;
  const formatedResultClasses = classnames('Header__button Header__button--icon', {active: formatedResult});
  return (
    <header className="CodeMirror-gutters Header">
      {stylesheet}
      <select value={theme} onChange={onChangeTheme}>{themesOptions}</select>
      <button className={formatedResultClasses} onClick={() => onToggleFormatedResult(!formatedResult)}>
        <i className="mdi mdi-code-braces" />
      </button>
    </header>
  );
}

Header.displayName = 'Header';

const mapStateToProps = ({ theme, formatedResult }) => ({ theme, formatedResult });
const mapDispatchToProps = (dispatch) => ({
  onChangeTheme: (e) => dispatch(changeTheme(e.target.value)),
  onToggleFormatedResult: compose(dispatch, setFormatedResult)
});

export default connect(mapStateToProps,mapDispatchToProps)(Header);
