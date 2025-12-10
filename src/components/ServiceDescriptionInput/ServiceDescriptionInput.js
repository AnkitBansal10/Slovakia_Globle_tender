import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

const ServiceDescriptionInput = () => {
  const [description, setDescription] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Service Description"
        placeholderTextColor="#888"
        multiline={true}
        numberOfLines={4}
        onChangeText={setDescription}
        value={description}
        textAlignVertical="top"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  input: {
    minHeight: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: colors.text
  },
});

export default ServiceDescriptionInput;