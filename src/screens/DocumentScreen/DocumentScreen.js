import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from 'react-native';
import { colors } from '../../utils/colors';

const DocumentScreen = () => {
  const [activeFilter, setActiveFilter] = useState('passport');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);

  // Sample file data
  const files = [
    { id: '1', name: "Assignment 1.docx", time: "22:18 11/7 PM, 20 Dec 2023", size: "", type: 'docx' },
    { id: '2', name: "Documentation 1.csv", time: "11/7 PM, 20 Dec 2023", size: "17 KB", type: 'csv' },
    { id: '3', name: "Assign 21.rtf", time: "11/7 PM, 20 Dec 2023", size: "24/0 MB", type: 'rtf' },
    { id: '4', name: "Sir Kashif.docx", time: "11/7 PM, 20 Dec 2023", size: "23 KB", type: 'docx' },
    { id: '5', name: "Assign 3.pdf", time: "11/7 PM, 20 Dec 2023", size: "6 MB", type: 'pdf' },
    { id: '6', name: "Cradentials.docx", time: "11/7 PM, 20 Dec 2023", size: "23 KB", type: 'docx' },
  ];

  // Check if file is passport-related
  const isPassportFile = (filename) => {
    const passportKeywords = ['passport', 'visa', 'immigration', 'travel document', 'national id'];
    const lowerName = filename.toLowerCase();
    return passportKeywords.some(keyword => lowerName.includes(keyword));
  };

  // Filter files based on active filter and search
  useEffect(() => {
    let result = files;

    // Apply passport filter
    if (activeFilter === 'passport') {
      result = result.filter(file => isPassportFile(file.name));
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(file => 
        file.name.toLowerCase().includes(query)
      );
    }

    setFilteredFiles(result);
  }, [activeFilter, searchQuery]);

  // Get file icon based on type
  const getFileIcon = (type) => {
    const icons = {
      docx: '📄',
      pdf: '📕',
      csv: '📊',
      rtf: '📝',
      default: '📎'
    };
    return icons[type] || icons.default;
  };

  // Render file item
  const renderFileItem = ({ item }) => (
    <View style={styles.fileItem}>
      <Text style={styles.fileIcon}>{getFileIcon(item.type)}</Text>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileDetails}>
          {item.size && `${item.size} • `}{item.time}
        </Text>
      </View>
      {isPassportFile(item.name) && (
        <View style={styles.passportBadge}>
          <Text style={styles.passportBadgeText}>PASSPORT</Text>
        </View>
      )}
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📁</Text>
      <Text style={styles.emptyStateTitle}>No Passport Documents Found</Text>
      <Text style={styles.emptyStateText}>
        No files containing passport, visa, or travel-related terms were found.
      </Text>
      <Text style={styles.emptyStateHint}>
        Current filter: Passport Only{'\n'}
        Try checking if your passport documents have different names.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ALL FILES</Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'all' && styles.activeTab]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.tabText, activeFilter === 'all' && styles.activeTabText]}>
            All Files
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'passport' && styles.activeTab]}
          onPress={() => setActiveFilter('passport')}
        >
          <Text style={[styles.tabText, activeFilter === 'passport' && styles.activeTabText]}>
            Passport Only
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'recent' && styles.activeTab]}
          onPress={() => setActiveFilter('recent')}
        >
          <Text style={[styles.tabText, activeFilter === 'recent' && styles.activeTabText]}>
            Recent
          </Text>
        </TouchableOpacity>
      </View>

      {/* File List */}
      <View style={styles.fileList}>
        <FlatList
          data={filteredFiles}
          renderItem={renderFileItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor:colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchSection: {
    backgroundColor:colors.primary,
    padding: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    backgroundColor: 'white',
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '600',
  },
  fileList: {
    flex: 1,
    backgroundColor: 'white',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  passportBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  passportBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emptyStateHint: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default DocumentScreen;