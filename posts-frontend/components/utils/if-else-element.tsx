import { ReactNode } from 'react';

/**
 * A conditional element.
 * @param if - condition to check.
 * @param then - return this element if condition is true.
 * @param else - return this element if condition is false.
 * @returns 
 */
export default function IfElseElement({
  if: condition,
  then: elementThen,
  else: elementElse,
}: {
  if: any;
  then: ReactNode;
  else?: ReactNode;
}): JSX.Element {
  return condition ? <>{elementThen}</> : <>{elementElse}</>;
}
