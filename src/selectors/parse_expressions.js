import { transform } from 'babel-standalone';
import esprima from 'esprima';

const parseExpressions = (code) => {
  const transformedCode = transform(code, {
    presets: ['react'],
    retainLines: true
  }).code;
  const codeByLine = transformedCode.split('\n');

  const expressions = esprima
      .parse(transformedCode, { loc: true })
      .body
      .filter(({ type }) => type === 'ExpressionStatement')
      .map(({ loc }) => loc.end.line)
      .map(line => ({
        line,
        expression: codeByLine.slice(0, line).join('')
      }));

  return expressions;
}

export default parseExpressions;
