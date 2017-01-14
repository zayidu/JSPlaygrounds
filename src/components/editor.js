import compose from 'lodash/fp/compose';
import forEach from 'lodash/forEach';
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/jsx/jsx';
import { connect } from 'react-redux';

import { updateCode, updateCursorPosition, saveSnippet } from 'actions';
import parseExpressions from 'selectors/parse_expressions';

const Editor = React.createClass({
  componentDidMount(){
    this.codemirror = this.refs.codemirror.getCodeMirror();
    this.codemirror.on('cursorActivity', this.handleCursorActivity);
  },

  componentWillReceiveProps({ cursorPosition }) {
    const { doc } = this.codemirror;
    if (cursorPosition.force) {
      const { line, ch } = cursorPosition;
      doc.setCursor({ line, ch });
      this.refs.codemirror.focus();
    }
  },

  handleCursorActivity({ doc }){
    this.props.onUpdateCursorPosition(doc.getCursor());
  },

  render(){
    const { currentSnippet, snippets, theme, onCodeChange } = this.props;

    return (
      <div>
        <CodeMirror
          ref="codemirror"
          value={currentSnippet.latest}
          onChange={onCodeChange(currentSnippet, snippets)}
          options={{ theme, mode: 'jsx', lineNumbers: true, tabSize: 2 }} />
      </div>
    );
  }
});

const mapStateToProps = ({ snippets, currentSnippet , theme, cursorPosition }) => ({
  theme,
  snippets,
  cursorPosition,
  currentSnippet,
});

const mapDispatchToProps = dispatch => ({
  onCodeChange: (currentSnippet, snippets) => code => {
    const snippet = Object.assign({}, currentSnippet, getCodeStateFromCode(currentSnippet, code));
    dispatch(updateCode(snippet));
    const snippetIsSaved = !! snippets.find(({ id }) => id === snippet.id);
    if (snippetIsSaved) {
      dispatch(saveSnippet(snippet));
    }
  },
  onUpdateCursorPosition: compose(dispatch, updateCursorPosition)
});

const getCodeStateFromCode = (currentSnippet, code) => {
  const latest = code;
  let errors = [];
  let { stable } = currentSnippet;
  try {
    const expressions = parseExpressions(code);
    forEach(expressions, (exp, line) => {
      try {
        eval(exp);
      } catch (err) {
        errors.push({
          line,
          message: err.toString(),
        });
      }
    });

    if(errors.length) throw new Error('Code has some errors', errors);
    stable = code;
  } catch (e) {};

  return {
    latest,
    stable,
    errors
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
