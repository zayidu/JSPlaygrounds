import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import compose from 'lodash/fp/compose';
import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import { updateCursorPosition } from 'actions';

const coma = (arr, i) => i < arr.length -1 ? ', ' :'';

const formatResult = (result) => {

  if (result === undefined)
    return <span className="cm-atom">undefined</span>;

  if (result && result.type)
    return <div className="result__react">{result}</div>;

  if (result === null)
    return <span className="cm-atom">null</span>;

  if (result === null)
    return <span className="cm-atom">null</span>;

  if (isBoolean(result))
    return <span className="cm-atom">{result ? 'true' : 'false'}</span>;

  if (isNumber(result)) {
    return <span className="cm-number">{isNaN(result) ? 'NaN' : result}</span>
  }

  if (isString(result))
    return <span className="cm-string">"{result}"</span>

  if (isFunction(result))
    return <em><span className="cm-keyword">function</span> <span className="cm-def">{result.name || 'anonymous'}</span></em>;

  if (isArray(result))
    return <span>[{result.map((v, i, arr) => <span key={i}>{formatResult(v)}{coma(arr, i)}</span>)}]</span>;

  if (isObject(result))
    return <span>{'{ '}{_.map(result, (v, k) => ({k, v})).map(({k, v}, i, arr) =>(
      <span key={k}><span className="cm-property">{k}</span>: {formatResult(v)}{coma(arr, i)}</span>
    ))} {' }'}</span>;

  return result;
};

const simpleResult = (result) => {
  if (result && result.type)
    return <div className="result__react">{result}</div>;

  if (isFunction(result) && result.name)
    return <i>Function {result.name}</i>;

  if (result === null)
    return 'Null';

  if (isBoolean(result))
    return result ? 'True' : 'False';

  if (isObject(result) || isArray(result))
    return JSON.stringify(result);

  return result;
}


const ResultExpression = ({ expression, line,  formatedResult, cursorPosition, onChangeCursorPosition }) => {
  const expressionEvaluated = eval(expression);
  const result = formatedResult ? formatResult(expressionEvaluated) : simpleResult(expressionEvaluated);
  if(result){
      const lineNumberClassName = classnames(
        'CodeMirror-linenumber CodeMirror-gutter-elt result__line-number',
        {'result__line-number--current': `${line}` === `${cursorPosition.line + 1}`}
      );
      const onClickLineNumber = () => onChangeCursorPosition({ line: line - 1, ch: 0, force: true });
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
