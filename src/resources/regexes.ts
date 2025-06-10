export const passwordSpecialChars = '@$!%*?&'
export const mobileNumberOperators = [10, 12, 50, 55, 66, 70, 77, 99]

export const regexes = {
  users: {
    username: /^[a-zA-Z0-9_-]+$/,
    password: new RegExp(
      `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${passwordSpecialChars}]).+$`,
    ),
    mobileNumber: new RegExp(
      `^(?:(?:994)?(?:0)?)?(${mobileNumberOperators.join('|')})([1-9]\\d{6})$`,
    ),
  },
}
