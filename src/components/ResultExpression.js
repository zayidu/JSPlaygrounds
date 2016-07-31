import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import compose from 'lodash/fp/compose';

import { updateCursorPosition } from 'actions';

const coma = (arr, i) => i < arr.length -1 ? ', ' :'';

const formatResult = (result) => {

  // perhaps an option later
  // if (result === undefined)
  //   return <span className="cm-atom">undefined</span>;

  if (result && result.type)
    return <div className="result__react">{result}</div>;

  if (result === null)
    return <span className="cm-atom">null</span>;

  if (_.isBoolean(result))
    return <span className="cm-atom">{result ? 'true' : 'false'}</span>;

  if (_.isNumber(result))
    return <span className="cm-number">{result}</span>

  if (_.isString(result))
    return <span className="cm-string">"{result}"</span>

  if (_.isFunction(result))
    return <em><span className="cm-keyword">function</span> <span className="cm-def">{result.name || 'anonymous'}</span></em>;

  if (_.isArray(result))
    return <span>[{result.map((v, i, arr) => <span key={i}>{formatResult(v)}{coma(arr, i)}</span>)}]</span>;

  if (_.isObject(result))
    return <span>{'{'}{_.map(result, (v, k) => ({k, v})).map(({k, v}, i, arr) =>(
      <span key={k}><span className="cm-property">{k}</span>: {formatResult(v)}{coma(arr, i)}</span>
    ))} {'}'}</span>;

  return result;
};

const simpleResult = (result) => {
  if (result && result.type)
    return <div className="result__react">{result}</div>;

  if (_.isFunction(result) && result.name)
    return <i>Function {result.name}</i>;

  if (result === null)
    return 'Null';

  if (_.isBoolean(result))
    return result ? 'True' : 'False';

  if (_.isObject(result) || _.isArray(result))
    return JSON.stringify(result);

  return result;
}


const ResultExpression = ({ expression, line,  formatedResult, cursorPosition, onChangeCursorPosition }) => {
  const result = formatedResult ? formatResult(expression) : simpleResult(expression);
  if(result){
      const lineNumberClassName = classnames(
        'CodeMirror-linenumber CodeMirror-gutter-elt result__line-number',
        {'result__line-number--current': `${line}` === `${cursorPosition.line + 1}`}
      );
      const onClickLineNumber = () => onChangeCursorPosition({ line: line - 1, ch: 0 });
      return(
        <div className="result__line">
          <div className={lineNumberClassName} onClick={onClickLineNumber}>{line}</div>
          <div className="result__expression">{result}</div>
        </div>
      );
    }
  return null;
}


const mapStateToProps = ({ formatedResult, cursorPosition }) => ({ formatedResult, cursorPosition });
const mapDispatchToProps = (dispatch) => ({
  onChangeCursorPosition: compose(dispatch, updateCursorPosition)
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultExpression);
