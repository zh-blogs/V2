module.exports = {
  trailingComma: "all",
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  importOrder: [
    "(next|react).*",
    "<THIRD_PARTY_MODULES>",
    "@/components.*",
    "@/utils.*",
  ],
  importOrderSeparation: true,
};
