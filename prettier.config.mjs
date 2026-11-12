import sortImports from '@trivago/prettier-plugin-sort-imports';
import braceStyle from 'prettier-plugin-brace-style';
import * as curly from 'prettier-plugin-curly';

export default {
  plugins: [curly, braceStyle, sortImports],
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 130,
  tabWidth: 2,
  endOfLine: 'auto',
  bracketSpacing: true,
  braceStyle: '1tbs',
  importOrder: ['<THIRD_PARTY_MODULES>', '^[.]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
