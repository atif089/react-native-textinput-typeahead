import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import TextInputTypeAhead from './index';

describe('TextInputTypeAhead', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<TextInputTypeAhead getSuggestionsPromise={() => Promise.resolve()} />);
    expect(getByText('Type something...')).toBeTruthy();
  });

  it('displays initial value if provided', () => {
    const { getByDisplayValue } = render(<TextInputTypeAhead value="initial" getSuggestionsPromise={() => Promise.resolve()} />);
    expect(getByDisplayValue('initial')).toBeTruthy();
  });

  it('debounces the input change and fetches suggestions', async () => {
    jest.useFakeTimers();
    const mockGetSuggestions = jest.fn().mockResolvedValue('suggestion');
    const { getByTestId } = render(<TextInputTypeAhead getSuggestionsPromise={mockGetSuggestions} />);
    const input = getByTestId('textInput');

    fireEvent.changeText(input, 'react');

    // Advance timers by the debounce time
    act(() => {
      jest.advanceTimersByTime(400);  // Adjust this time to match your debounceTime
    });

    expect(mockGetSuggestions).toHaveBeenCalledTimes(1);
    expect(mockGetSuggestions).toHaveBeenCalledWith('react', expect.any(Object));
  });

  it('applies the suggestion when clicked', async () => {
    const onChangeText = jest.fn();
    const mockGetSuggestions = jest.fn().mockResolvedValue('suggestion');
    const { getByTestId, findByText } = render(<TextInputTypeAhead getSuggestionsPromise={mockGetSuggestions} onChangeText={onChangeText} />);
    const input = getByTestId('textInput');

    fireEvent.changeText(input, 'sugg');
    act(() => {
      jest.runAllTimers();
    });

    const suggestionText = await findByText('suggestion'); // Use findByText to wait for the element
    fireEvent.press(suggestionText);

    expect(input.props.value).toBe('suggestion');
    expect(onChangeText).toHaveBeenCalledWith('suggestion');
  });
});
