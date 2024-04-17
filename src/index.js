import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";

const TextInputTypeAhead = ({
  getSuggestionsPromise,
  onChangeText,
  value: propValue,
  placeholder = "Type something...",
  styleOverrides = {},
  debounceTime = 400,
  minChars = 3
}) => {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useRef(null);
  const abortController = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setInput(propValue || "");
  }, [propValue]);

  // Handles user input changes, debounces fetch suggestions call
  const handleChange = (text) => {
    setInput(text);
    setSuggestion(""); // Clear current suggestion
    if (onChangeText) {
      onChangeText(text); // Call the provided onChangeText function with the new input value
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(text), debounceTime);
  };

  const fetchSuggestions = (text) => {
    if (!text || text.trim().length < minChars) return;

    // Cancel any ongoing fetch operation
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    console.log("Fetching suggestions for:", text);
    if (!getSuggestionsPromise) return;
    getSuggestionsPromise(text, { signal: abortController.current.signal })
      .then((response) => {
        setSuggestion(response); // Assuming the response is the suggestion text
        console.log("Suggestion:", response);
      })
      .catch((error) => console.log("Error fetching suggestions:", error));
  };

  // Applies the suggestion
  const applySuggestion = () => {
    setInput(suggestion);
    setSuggestion("");
    if (onChangeText) {
      onChangeText(suggestion); // Also call onChangeText when applying a suggestion
    }
    inputRef.current.focus(); // Focus back on the input after applying
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (abortController.current) abortController.current.abort();
    };
  }, []);

  return (
    <View style={[styles.container, styleOverrides.container]}>
      <Text onPress={applySuggestion} style={styles.touchArea}>
        {/* Ensure input and suggestion are inline */}
        <Text style={[styles.inputText, styleOverrides.inputText]}>{input}</Text>
        <Text style={[styles.suggestionText, styleOverrides.suggestionText]}>
          {input.length === 0 ? placeholder : suggestion.substring(input.length)}
        </Text>
      </Text>
      <TextInput
        ref={inputRef}
        onChangeText={handleChange}
        value={input}
        style={[styles.hiddenInput, styleOverrides.hiddenInput]}
        testID="textInput"
      // Edit: Removed placeholder from here
      />
    </View>
  );
};

// Edit: Added placeholder style
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  touchArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-start",
    fontSize: 16
  },
  inputText: {
    color: "#000",
    height: 12,
  },
  suggestionText: {
    color: "#ccc",
    height: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: "#ccc",
  },
  hiddenInput: {
    ...Platform.select({
      ios: { height: 0, position: "absolute", left: -10000 },
      android: { height: 1, position: "absolute", top: -5 }
    }),
    width: 1
  }
});

export default TextInputTypeAhead;
