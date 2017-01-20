import compose from 'lodash/fp/compose';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';

import { updateCode, updateCursorPosition, saveSnippet } from 'actions';
import parseExpressions from 'libs/parseExpressions';
import getError from 'libs/getError';

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

  componentDidUpdate() {
    const { error } = this.props.currentSnippet;
    const { doc } = this.codemirror;
    doc.clearGutter('gutter-errors');

    if (error) {
      if (error.line) {
        const marker = document.createElement('span');
        marker.className="gutter-errors__marker";
        doc.setGutterMarker(error.line -1, 'gutter-errors', marker);
      }
    }
  },

  render(){
    const { currentSnippet, snippets, theme, onCodeChange } = this.props;

    return (
      <div>
        <CodeMirror
          ref="codemirror"
          value={currentSnippet.latest}
          onChange={onCodeChange(currentSnippet, snippets)}
          options={{
            theme, mode: 'jsx',
            lineNumbers: true,
            tabSize: 2,
            keyMap: 'sublime',
            matchBrackets: true,
            matchTags: true,
            gutters: ['gutter-errors']
          }} />
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
  const error = getError(code);
  const latest = code;
  const { stable } = currentSnippet;

  return {
    error,
    latest,
    stable: error ? stable : latest,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
