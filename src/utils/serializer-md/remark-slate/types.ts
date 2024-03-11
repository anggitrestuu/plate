import { PlateEditor, TElement, Value } from '@udecode/plate-common';

export interface MdastNode {
  type?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'li'
    | 'ul'
    | 'ol'
    | 'image'
    | 'link'
    | 'hr'
    | 'blockquote'
    | 'code_block'
    | 'code_line'
    | 'a'
    | 'lic';
  italic?: boolean;
  bold?: boolean;
  ordered?: boolean;
  value?: string;
  text?: string;
  children?: Array<MdastNode>;
  depth?: 1 | 2 | 3 | 4 | 5 | 6;
  url?: string;
  alt?: string;
  lang?: string;
  // mdast metadata
  position?: any;
  spread?: any;
  checked?: any;
  indent?: any;
  listStyleType?: 'disc' | 'decimal';
  listStart?: number;
}
