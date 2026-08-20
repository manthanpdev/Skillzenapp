import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { FormattedMessageProps, InlineTextProps } from "@/utils/types/Apptypes";

// Renders a single line, picking out **bold** and `inline code` spans.
// Kept local to this file since it is only ever used by FormattedMessage below.
const InlineText = ({ line, style }: InlineTextProps) => {
  const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);

  return (
    <Text style={style}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={i} style={styles.boldText}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <Text key={i} style={styles.inlineCode}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
};

// Minimal markdown-ish renderer: headings, bullets, numbered lists,
// code fences, horizontal rules, and plain paragraphs. No external libs.
const FormattedMessage = ({ text }: FormattedMessageProps) => {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  // Walk the lines once, matching each against the markdown patterns above
  // and pushing the matching block; `i` is advanced by however many lines
  // that block consumed (a fenced code block consumes more than one line).
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <View key={key++} style={styles.codeBlock}>
          <Text style={styles.codeBlockText}>{codeLines.join("\n")}</Text>
        </View>
      );
      continue;
    }

    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      blocks.push(<View key={key++} style={styles.hr} />);
      i++;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      blocks.push(
        <InlineText
          key={key++}
          line={content}
          style={level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3}
        />
      );
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      blocks.push(
        <View key={key++} style={styles.listItemRow}>
          <Text style={styles.bulletDot}>{"•"}</Text>
          <InlineText
            line={trimmed.replace(/^[-*]\s+/, "")}
            style={styles.listItemText}
          />
        </View>
      );
      i++;
      continue;
    }

    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      blocks.push(
        <View key={key++} style={styles.listItemRow}>
          <Text style={styles.bulletDot}>{numberedMatch[1]}.</Text>
          <InlineText line={numberedMatch[2]} style={styles.listItemText} />
        </View>
      );
      i++;
      continue;
    }

    if (trimmed === "") {
      blocks.push(<View key={key++} style={styles.blankLine} />);
      i++;
      continue;
    }

    blocks.push(
      <InlineText key={key++} line={trimmed} style={styles.paragraph} />
    );
    i++;
  }

  return <View>{blocks}</View>;
};

export default FormattedMessage;

const styles = StyleSheet.create({
  boldText: {
    fontWeight: "700",
    color: theme.colors.text,
  },

  inlineCode: {
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.primary,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    fontSize: 13,
  },

  paragraph: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },

  h1: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 6,
  },

  h2: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 5,
  },

  h3: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 4,
  },

  listItemRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },

  bulletDot: {
    color: theme.colors.primary,
    fontWeight: "700",
    marginRight: 8,
    fontSize: 14,
  },

  listItemText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },

  codeBlock: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },

  codeBlockText: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    fontSize: 12.5,
    color: theme.colors.text,
    lineHeight: 18,
  },

  hr: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },

  blankLine: {
    height: 6,
  },
});
