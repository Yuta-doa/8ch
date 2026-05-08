import { anchorToPostNumber, splitAnchors } from "@/lib/anchors";

type AnchorTextProps = {
  text: string;
};

export function AnchorText({ text }: AnchorTextProps) {
  const tokens = splitAnchors(text);

  return (
    <>
      {tokens.map((token, index) => {
        const postNumber = anchorToPostNumber(token);

        if (!postNumber) {
          return <span key={`${token}-${index}`}>{token}</span>;
        }

        return (
          <a key={`${token}-${index}`} href={`#post-${postNumber}`}>
            {token}
          </a>
        );
      })}
    </>
  );
}