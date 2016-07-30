import _ from 'lodash';
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/jsx/jsx';
import { updateCode } from 'actions';
import { connect } from 'react-redux';
import { local } from 'store2';

const Editor = ({ code, theme, onCodeChange }) => {
  return (
    <div>
      <CodeMirror
        value={code}
        onChange={onCodeChange}
        options={{ theme, mode: 'jsx', lineNumbers: true, tabSize: 2 }} />
    </div>
  );
};

function mapStateToProps({ code, theme }) {
  return { code, theme };
}

const mapDispatchToProps = (dispatch) => ({
  onCodeChange: (code) => {
    dispatch(updateCode(code));
    local.set('code', code);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
