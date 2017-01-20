import transformCode from './transformCode';
import compose from 'lodash/fp/compose';
import esprima from 'esprima';

const parseExpressions = compose(
  tranformedCode => tranformedCode
    .ast.program.body
    .filter(({ type }) => type === 'ExpressionStatement')
    .map(({ loc }) => loc.end.line)
    .map(line => ({
      line,
      expression: tranformedCode
        .code
        .split('\n')
        .slice(0, line)
        .join('')
    })),
  transformCode
)

export default parseExpressions;
