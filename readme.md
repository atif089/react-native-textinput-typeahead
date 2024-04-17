`react-native-textinput-typeahead` is a React Native component designed to provide predictive text input. This component serves as a wrapper around the standard text input element, adding the capability to suggest possible completions for the text being entered.

Tested with Expo 50 ("react-native": "^0.73.6")

# Demo

[Demo](./docs/demo.mp4)

# Import the component

`import TextInputTypeAhead from 'react-native-textinput-typeahead';`

# Usage

1. Setup the component

```jsx
  <TextInputTypeAhead
    onChangeText={(val) => {
      // dome something with val like .. setInputVal(val)
      }
    }
    placeholder="Type a City Name..."
    styleOverrides={{
      container: { margin: 10 },
      inputText: { margin: 10, color: "#33a" },
      suggestionText: { margin: 10, color: "#ccc" },
      hiddenInput: { left: -10000 },
    }}
    getSuggestionsPromise={getSuggestionPromiseHandler}
    debounceTime={300}
    minChars={3}
  />
```

2. Set up suggestions handler

```js
  const getSuggestionPromiseHandler = (query) => {
    const cities = ["Amsterdam", "Barcelona", "Berlin", "Boston", "Buenos Aires", "Cairo", "Chicago", "Dallas", "Denver", "Detroit", "Dubai", "Essen", "Frankfurt", "Hamburg", "Hong Kong", "Houston", "Istanbul", "Jakarta", "Johannesburg", "Kiev", "London", "Los Angeles", "Madrid", "Manila", "Mexico City", "Miami", "Moscow", "Mumbai", "New York", "Oslo", "Paris", "Philadelphia", "Phoenix", "Portland", "Prague", "Rio de Janeiro", "Rome", "San Francisco", "Seoul", "Shanghai", "Singapore", "Stockholm", "Sydney", "Tokyo", "Toronto", "Vancouver", "Vienna", "Washington DC", "Warsaw", "Zurich"];

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const suggestions = cities.filter(city => city.toLowerCase().includes(query.toLowerCase()));
        console.log(`query, suggestions`);
        console.log(query, suggestions);
        if (suggestions && suggestions[0]) {
          resolve(suggestions[0]);
        } else {
          resolve("");
        }
      }, 300);
    });
  }
```
