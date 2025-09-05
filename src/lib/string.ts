import { A, F, O, pipe, S } from "@mobily/ts-belt";

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

export function searchablText(text: string) {
  return pipe(text, S.toLowerCase, S.replaceByRe(/\s+/g, " "));
}

export function trimParagraph(text?: string | null, max = 100) {
  return pipe(
    text,
    O.fromNullable,
    O.mapWithDefault("", F.identity),
    F.ifElse(
      (txt) => txt.length > max,
      (txt) => pipe(txt, S.slice(0, max), S.append("...")),
      F.identity,
    ),
  );
}
