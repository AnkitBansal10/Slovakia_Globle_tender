import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { scale } from '../../utils/Responsive';
import { colors } from '../../utils/colors';
import { Poppins_Fonts } from '../../utils/fonts';

// Mock AI response function - replace with actual API call
const getAIResponse = async (userMessage) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    "I understand your question. Let me help you with that.",
    "That's a great question! Based on my knowledge, here's what I can tell you...",
    "I appreciate you asking. Here's some information that might help:",
    "Let me provide you with some insights on that topic.",
    "I can assist you with that. Here are the details you need."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const MessageBubble = ({ message, isUser }) => {
  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.botMessageText
        ]}>
          {message}
        </Text>
        <Text style={[
          styles.timeText,
          isUser ? styles.userTimeText : styles.botTimeText
        ]}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const TypingIndicator = () => {
  return (
    <View style={[styles.messageContainer, styles.botMessageContainer]}>
      <View style={[styles.messageBubble, styles.botBubble]}>
        <View style={styles.typingContainer}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?', // Fixed the syntax error here
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Get AI response
      const botResponse = await getAIResponse(inputText);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      // Add bot message
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([
              {
                id: '1',
                text: 'Hello! I\'m your AI assistant. How can I help you today?',
                isUser: false,
                timestamp: new Date(),
              },
            ]);
          },
        },
      ],
    );
  };

  const renderMessage = ({ item }) => (
    <MessageBubble message={item.text} isUser={item.isUser} />
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? scale(90) : scale(70)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.chatInfo}>
            <View style={styles.statusIndicator} />
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? <TypingIndicator /> : null
          }
        />
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={colors.borderColor}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <View style={styles.inputActions}>
            <Text style={styles.charCount}>
              {inputText.length}/500
            </Text>
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: Platform.OS === 'ios' ? scale(50) : scale(20),
    paddingBottom: scale(15),
    backgroundColor: colors.text || '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flex: 1,
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  statusIndicator: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#4CAF50',
    marginRight: scale(8),
  },
  headerTitle: {
    fontSize: scale(18),
    fontFamily: Poppins_Fonts.Poppins_SemiBold,
    color: colors.primaryText || '#333',
  },
  headerSubtitle: {
    fontSize: scale(12),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: colors.borderColor || '#666',
    marginLeft: scale(16),
  },
  clearButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
  },
  clearButtonText: {
    fontSize: scale(14),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: '#B99147',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
  },
  messageContainer: {
    marginVertical: scale(4),
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: scale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#B99147',
    borderBottomRightRadius: scale(4),
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: scale(4),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: scale(14),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    lineHeight: scale(20),
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: colors.primaryText
  },
  timeText: {
    fontSize: scale(10),
    marginTop: scale(4),
    opacity: 0.7,
  },
  userTimeText: {
    color: '#fff',
    textAlign: 'right',
  },
  botTimeText: {
    color: colors.borderColor || '#666',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(4),
  },
  typingDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: colors.borderColor || '#999',
    marginHorizontal: scale(2),
    opacity: 0.6,
  },
  inputContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    backgroundColor: colors.text || '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
inputWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: scale(24),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    minHeight: scale(50), // Ensure this is tall enough
    maxHeight: scale(100),
    justifyContent: 'center', // Add this
  },
textInput: {
    flex: 1,
    fontSize: scale(14),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: '#000000',
    // Remove both height and maxHeight constraints
    textAlignVertical: 'center',
    paddingVertical: scale(8), // Add vertical padding instead
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(4),
  },
  charCount: {
    fontSize: scale(10),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: colors.borderColor || '#999',
  },
  sendButton: {
    backgroundColor: '#B99147',
    paddingHorizontal: scale(16),
    paddingVertical: scale(6),
    borderRadius: scale(15),
    minWidth: scale(60),
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: scale(12),
    fontFamily: Poppins_Fonts.Poppins_SemiBold,
    color: '#fff',
  },
});