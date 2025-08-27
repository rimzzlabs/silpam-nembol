import { A, O, pipe, S } from "@mobily/ts-belt";

export function numericStringOnly(str?: string | null) {
  return pipe(
    str,
    O.fromNullable,
    O.getWithDefault(""),
    S.replaceByRe(/\s+/g, ""),
    S.replaceByRe(/[^\d]/g, ""),
  );
}

export function censorEmail(email: string) {
  let [username, provider] = email.split("@");

  let length = username.length;
  let left = pipe(username, S.slice(0, 1));
  let right = pipe(username, S.slice(length - 1, length));
  let mid = pipe(username, S.slice(1, length - 1), (s) => {
    let length = s.length > 5 ? 5 : s.length;
    return pipe("*", S.repeat(length));
  });

  return pipe(
    left,
    S.append(mid),
    S.append(right),
    S.append("@"),
    S.append(provider),
  );
}

export function toTitle(text: string) {
  return pipe(
    text,
    S.split(" "),
    A.map((txt) => txt.slice(0, 1).toUpperCase() + txt.slice(1).toLowerCase()),
    A.join(" "),
  );
}

/**
 *
 * @param maxLength default to 2
 * @returns
 */
export function toInitial(maxLength = 2) {
  return (text: string) => {
    return pipe(
      text,
      S.split(" "),
      A.map((txt) => txt.slice(0, 1).toUpperCase()),
      A.slice(0, maxLength),
      A.join(""),
    );
  };
}

export function generatePassword(length = 8) {
  let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lowercase = "abcdefghijklmnopqrstuvwxyz";
  let numeric = "1234567890";
  let specialChars = `!@#$%^&*()_+-=[]{}|;\\:,./<>?${"`"}~`;

  let chars = pipe(
    uppercase,
    S.append(lowercase),
    S.append(numeric),
    S.append(specialChars),
  );

  if (length < 4) {
    return pipe(
      0,
      A.range(length),
      A.map(() => chars[Math.floor(Math.random() * chars.length)]),
      A.join(""),
    );
  }

  let getRandomChars = (chars: string) => {
    return pipe(
      chars,
      S.get(Math.floor(Math.random() * chars.length)),
      O.getWithDefault(chars[0]),
    );
  };

  let passwordArray = [
    getRandomChars(uppercase),
    getRandomChars(lowercase),
    getRandomChars(numeric),
    getRandomChars(specialChars),
  ];

  return pipe(
    0,
    A.range(length - 4),
    A.map(() => getRandomChars(chars)),
    A.concat(passwordArray),
    A.join(""),
  );
}

export function searchablText(text: string) {
  return pipe(text, S.toLowerCase, S.replaceByRe(/\s+/g, " "));
}
