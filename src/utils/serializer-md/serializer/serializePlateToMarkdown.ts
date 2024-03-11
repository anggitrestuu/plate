import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote';
import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
} from '@udecode/plate-code-block';
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/plate-heading';
import { ELEMENT_HR } from '@udecode/plate-horizontal-rule';
import { ELEMENT_LINK } from '@udecode/plate-link';
import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_UL,
} from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';

import { MdastNode } from '../remark-slate/types';

type SerializePlateToMarkdownProps = {
  nodes: MdastNode[];
};

export const serializePlateToMarkdown = ({
  nodes,
}: SerializePlateToMarkdownProps) => {
  let text = '';

  const serializeNode = (node: MdastNode): string => {
    if (!node.children || node.children.length === 0) {
      let formattedText = node.text || '';

      // Apply formatting if any
      if (node.bold) formattedText = `**${formattedText}**`;
      if (node.italic) formattedText = `_${formattedText}_`;

      return formattedText;
    }

    if (node.indent) {
      let formattedText = '';

      let indent = '';

      if (node.indent > 1) {
        for (let i = 1; i < node.indent; i++) {
          indent += '     ';
        }
      }

      if (node.listStyleType === 'decimal') {
        if (!node.listStart) {
          formattedText = `1. ${formattedText}`;
        } else {
          formattedText = `${node.listStart}. ${formattedText}`;
        }
      }

      if (node.listStyleType === 'disc') {
        formattedText = `- ${formattedText}`;
      }

      return (
        indent +
        formattedText +
        node.children.map(serializeNode).join('') +
        '\n'
      );
    }

    // TODO : Add support for other list types

    switch (node.type) {
      case ELEMENT_PARAGRAPH:
        return node.children.map(serializeNode).join('') + '\n';
      case ELEMENT_H1:
        return `# ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_H2:
        return `## ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_H3:
        return `### ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_H4:
        return `#### ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_H5:
        return `##### ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_H6:
        return `###### ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_BLOCKQUOTE:
        return `> ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_CODE_BLOCK:
        return `\`\`\`\n${node.children.map(serializeNode).join('')}\n\`\`\`\n`;
      case ELEMENT_CODE_LINE:
        return node.children.map(serializeNode).join('');
      case ELEMENT_HR:
        return `---\n`;
      case ELEMENT_LINK:
        return `[${node.children.map(serializeNode).join('')}](${node.url})\n`;
      case ELEMENT_LI:
        return `- ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_LIC:
        return `  - ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_OL:
        return `1. ${node.children.map(serializeNode).join('')}\n`;
      case ELEMENT_UL:
        return `* ${node.children.map(serializeNode).join('')}\n`;

      default:
        return node.children.map(serializeNode).join('');
    }
  };

  text = nodes.map(serializeNode).join('');

  return text;
};
