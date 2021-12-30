export const judgeEmptyStr = (strings) => {
   return strings.replace(/(^\s*)|(\s*$)/g, "").length == 0
}