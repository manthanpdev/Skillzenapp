import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { TypingMessageProps } from "@/utils/types/Apptypes";
import FormattedMessage from "./MessageFormatter";

// Reveals `fullText` word-by-word like a typing effect, then hands the
// growing substring to FormattedMessage so markdown renders as it appears.
const TypingMessage = ({ fullText, onProgress }: TypingMessageProps) => {
  const words = useRef(fullText.split(" ")).current;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= words.length) return;

    const timer = setTimeout(() => {
      setCount((c) => c + 1);
      onProgress?.();
    }, 28); // typing speed — lower = faster

    return () => clearTimeout(timer);
  }, [count, words.length]);

  const visibleText = words.slice(0, count).join(" ");
  const isDone = count >= words.length;

  return (
    <View>
      <FormattedMessage text={visibleText} />
      {!isDone && <View style={styles.typingCursor} />}
    </View>
  );
};

export default TypingMessage;

const styles = StyleSheet.create({
  // Small blinking-style cursor block shown at the end of text while typing out
  typingCursor: {
    width: 6,
    height: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 1,
    marginTop: 2,
    opacity: 0.7,
  },
});
