import compose from 'lodash/fp/compose';
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/jsx/jsx';
import { updateCode, updateCursorPosition, saveSnippet } from 'actions';
import { connect } from 'react-redux';
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
    const { stable, latest } = getCodeStateFromCode(currentSnippet, code);
    const snippet = Object.assign({}, currentSnippet, { stable, latest });
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
  let { stable } = currentSnippet;
  try {
    parseExpressions(latest);
    stable = code;
  } catch (e) {};

  return {
    latest,
    stable
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
