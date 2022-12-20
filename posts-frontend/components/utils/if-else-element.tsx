import { ReactNode } from 'react';

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
