module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
};
