import { useState, useRef } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';

const TextInputTypeAhead = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const refinput = useRef();
  const cities = ['Amsterdam', 'Berlin', 'Copenhagen', 'Dublin']; // Example data

  const updateSuggestion = (input) => {
    setInputValue(input);
    const matchedCity = cities.find((city) =>
      city.toUpperCase().startsWith(input.toUpperCase())
    );
    setSuggestion(matchedCity || '');
  };

  return (
    <>
      <Text
        style={styles.suggestion}
        onPress={() => {
          refinput.current.focus();
        }}>
        <Text style={styles.suggestionInput}>
          {inputValue.trim() === '' ? `Type Ams or Ber or Cop...` : inputValue}
        </Text>
        <Text style={styles.typeahead}>
          {inputValue.trim().length < 3 || inputValue.trim() === ''
            ? ''
            : suggestion.slice(inputValue.length)}
        </Text>
      </Text>
      <TextInput
        ref={refinput}
        style={styles.input}
        value={inputValue}
        onChangeText={updateSuggestion}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    fontSize: 18,
    color: 'transparent',
  },
  suggestionInput: {
    color: 'black',
  },
  typeahead: {
    color: 'gray',
  },
  suggestion: {
    position: 'relative',
    top: 40, // Adjust based on your styling
    left: 9, // Adjust based on your styling
    fontSize: 18,
    color: 'gray',
    padding: 1,
  },
});

export default TextInputTypeAhead;
