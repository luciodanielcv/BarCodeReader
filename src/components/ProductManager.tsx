import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import productsData from '../../data/products.json';

interface Product {
  barcode: string;
  description: string;
  price: number;
}

interface ProductManagerProps {
  visible: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({
  visible,
  onClose,
  onProductUpdated,
}) => {
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [originalBarcode, setOriginalBarcode] = useState('');

  useEffect(() => {
    if (!visible) {
      // Reset form when modal closes
      setBarcode('');
      setDescription('');
      setPrice('');
      setIsUpdateMode(false);
      setOriginalBarcode('');
    }
  }, [visible]);

  const handleBarcodeCheck = (inputBarcode: string) => {
    setBarcode(inputBarcode);
    
    if (inputBarcode.trim()) {
      const existingProduct = productsData.find(
        (p: Product) => p.barcode === inputBarcode.trim()
      );
      
      if (existingProduct) {
        // Update mode
        setIsUpdateMode(true);
        setOriginalBarcode(existingProduct.barcode);
        setDescription(existingProduct.description);
        setPrice(existingProduct.price.toString());
      } else {
        // Insert mode
        setIsUpdateMode(false);
        setOriginalBarcode('');
        setDescription('');
        setPrice('');
      }
    } else {
      setIsUpdateMode(false);
      setOriginalBarcode('');
      setDescription('');
      setPrice('');
    }
  };

  const handleCancel = () => {
    setBarcode('');
    setDescription('');
    setPrice('');
    setIsUpdateMode(false);
    setOriginalBarcode('');
    onClose();
  };

  const handleAccept = () => {
    // Validation
    if (!barcode.trim()) {
      if (Platform.OS === 'web') {
        alert('Please enter a barcode');
      } else {
        Alert.alert('Error', 'Please enter a barcode');
      }
      return;
    }

    if (!description.trim()) {
      if (Platform.OS === 'web') {
        alert('Please enter a product description');
      } else {
        Alert.alert('Error', 'Please enter a product description');
      }
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      if (Platform.OS === 'web') {
        alert('Please enter a valid price (number >= 0)');
      } else {
        Alert.alert('Error', 'Please enter a valid price (number >= 0)');
      }
      return;
    }

    // Create/update product
    const updatedProducts = [...productsData];
    
    if (isUpdateMode) {
      // Update existing product
      const index = updatedProducts.findIndex(
        (p: Product) => p.barcode === originalBarcode
      );
      if (index !== -1) {
        updatedProducts[index] = {
          barcode: originalBarcode, // Keep original barcode (readonly)
          description: description.trim(),
          price: priceValue,
        };
      }
    } else {
      // Add new product
      updatedProducts.push({
        barcode: barcode.trim(),
        description: description.trim(),
        price: priceValue,
      });
    }

    // Sort by barcode for better organization
    updatedProducts.sort((a: Product, b: Product) => 
      a.barcode.localeCompare(b.barcode)
    );

    // Save to file
    saveProductsToFile(updatedProducts);
  };

  const saveProductsToFile = (products: Product[]) => {
    const jsonContent = JSON.stringify(products, null, 2);
    
    if (Platform.OS === 'web') {
      // For web: create download link
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'products.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show instructions
      const message = isUpdateMode
        ? 'Product updated! Please download the updated products.json file and replace the file in data/products.json, then refresh the page.'
        : 'Product added! Please download the updated products.json file and replace the file in data/products.json, then refresh the page.';
      
      alert(message);
    } else {
      // For native: show full JSON content for manual update
      Alert.alert(
        isUpdateMode ? 'Product Updated' : 'Product Added',
        `Please update data/products.json with the following content:\n\n${jsonContent}`,
        [
          { text: 'Copy JSON', onPress: () => {
            // Note: Clipboard functionality would require @react-native-clipboard/clipboard
            // For now, just show the alert with full content
          }},
          { text: 'OK' }
        ]
      );
    }

    // Reset form and close
    handleCancel();
    onProductUpdated();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isUpdateMode ? 'Update Product' : 'Add New Product'}
          </Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Barcode *</Text>
              <TextInput
                style={[
                  styles.input,
                  isUpdateMode && styles.inputReadonly,
                ]}
                placeholder="Enter barcode"
                value={barcode}
                onChangeText={handleBarcodeCheck}
                keyboardType="numeric"
                editable={!isUpdateMode}
                autoFocus={!isUpdateMode}
              />
              {isUpdateMode && (
                <Text style={styles.hintText}>
                  Barcode cannot be changed in update mode
                </Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product description"
                value={description}
                onChangeText={setDescription}
                autoFocus={isUpdateMode}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price (e.g., 2.50)"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>

            {isUpdateMode && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Updating existing product: {originalBarcode}
                </Text>
              </View>
            )}

            {!isUpdateMode && barcode.trim() && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  New product will be added
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Text style={styles.acceptButtonText}>
              {isUpdateMode ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2E7D32', // Green
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  form: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
  },
  inputReadonly: {
    backgroundColor: '#F5F5F5',
    color: '#757575',
  },
  hintText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: '#E3F2FD', // Light blue
    borderWidth: 1,
    borderColor: '#1976D2', // Blue
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#2E7D32', // Green
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductManager;

