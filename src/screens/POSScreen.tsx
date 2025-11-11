import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import ProductManager from '../components/ProductManager';
// Note: productsData will be reloaded when products are updated
let productsData = require('../../data/products.json');

interface Product {
  barcode: string;
  description: string;
  price: number;
}

interface CartItem {
  barcode: string;
  description: string;
  price?: number; // Optional for unknown products
  quantity: number;
  subtotal?: number; // Optional for unknown products
  isUnknown?: boolean; // Flag for unknown barcodes
}

const POSScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [manualBarcode, setManualBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showProductManager, setShowProductManager] = useState(false);
  const [productsUpdateKey, setProductsUpdateKey] = useState(0);
  const barcodeInputRef = useRef<TextInput>(null);
  const isWeb = Platform.OS === 'web';

  // Reload products data when updated
  const handleProductUpdated = () => {
    // Force reload of products data
    if (isWeb) {
      // On web, we need to reload the page to get updated JSON
      // Or we could use a fetch to reload the JSON
      window.location.reload();
    } else {
      // On native, reload the require
      delete require.cache[require.resolve('../../data/products.json')];
      productsData = require('../../data/products.json');
      setProductsUpdateKey(prev => prev + 1);
    }
  };

  const handleBarcodeScan = (barcode: string) => {
    // Clear any previous error
    setErrorMessage(null);
    
    const product = productsData.find((p: Product) => p.barcode === barcode);
    
    if (product) {
      addToCart(product);
      // Clear the input field after successful scan
      setManualBarcode('');
      // Focus the input field
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 100);
    } else {
      // Add unknown barcode to cart
      addUnknownBarcodeToCart(barcode);
      // Clear the input field
      setManualBarcode('');
      // Focus the input field
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 100);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.barcode === product.barcode);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.barcode === product.barcode
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: item.price ? (item.quantity + 1) * item.price : undefined,
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            barcode: product.barcode,
            description: product.description,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
            isUnknown: false,
          },
        ];
      }
    });
  };

  const addUnknownBarcodeToCart = (barcode: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.barcode === barcode);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.barcode === barcode
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            barcode: barcode,
            description: `Unknown Product (${barcode})`,
            quantity: 1,
            isUnknown: true,
          },
        ];
      }
    });
  };

  const updateQuantity = (barcode: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setCart((prevCart) => {
      if (newQuantity === 0) {
        return prevCart.filter((item) => item.barcode !== barcode);
      }
      
      return prevCart.map((item) =>
        item.barcode === barcode
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.price,
            }
          : item
      );
    });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      // Only include items with subtotal (known products)
      return sum + (item.subtotal || 0);
    }, 0);
  };

  const calculateTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    if (isWeb) {
      // Use browser confirm dialog for web
      if (window.confirm('Are you sure you want to clear all items?')) {
        setCart([]);
        setManualBarcode('');
        // Focus the input field after clearing
        setTimeout(() => {
          barcodeInputRef.current?.focus();
        }, 100);
      }
    } else {
      // Use native Alert for mobile platforms
      Alert.alert(
        'Clear Cart',
        'Are you sure you want to clear all items?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              setCart([]);
              setManualBarcode('');
            },
          },
        ]
      );
    }
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      handleBarcodeScan(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Point of Sale</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setShowProductManager(true)}
            style={[styles.manageButton, { marginRight: 8 }]}
          >
            <Text style={styles.manageButtonText}>Manage Products</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barcode Scanner Section */}
      <View style={styles.scannerSection}>
        {/* Error Message Display */}
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
        
        {/* Manual Barcode Input (always available, especially for web) */}
        <View style={styles.manualInputContainer}>
          <TextInput
            ref={barcodeInputRef}
            style={styles.manualInput}
            placeholder="Enter barcode manually"
            value={manualBarcode}
            onChangeText={setManualBarcode}
            onSubmitEditing={handleManualSubmit}
            keyboardType="numeric"
            autoFocus={isWeb}
          />
          <TouchableOpacity
            style={[styles.submitButton, { marginLeft: 8 }]}
            onPress={handleManualSubmit}
          >
            <Text style={styles.submitButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
        {!isWeb && (
          <Text style={styles.noteText}>
            Note: Camera scanning will be available on Android/iOS devices
          </Text>
        )}
      </View>

      {/* Products List */}
      <ScrollView style={styles.productsList} contentContainerStyle={styles.productsListContent}>
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>No products in cart</Text>
            <Text style={styles.emptyCartSubtext}>Scan or enter a barcode to add products</Text>
          </View>
        ) : (
          cart.map((item) => (
            <View key={item.barcode} style={[
              styles.cartItem,
              item.isUnknown && styles.cartItemUnknown
            ]}>
              <View style={styles.cartItemInfo}>
                <Text style={[
                  styles.cartItemDescription,
                  item.isUnknown && styles.cartItemDescriptionUnknown
                ]}>
                  {item.description}
                </Text>
                <Text style={[
                  styles.cartItemBarcode,
                  item.isUnknown && styles.cartItemBarcodeUnknown
                ]}>
                  Barcode: {item.barcode}
                </Text>
                {item.price !== undefined && (
                  <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} each</Text>
                )}
                {item.isUnknown && (
                  <Text style={styles.unknownProductLabel}>Price not available</Text>
                )}
              </View>
              <View style={styles.cartItemControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.barcode, item.quantity - 1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.barcode, item.quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              {item.subtotal !== undefined && (
                <View style={styles.cartItemSubtotal}>
                  <Text style={styles.subtotalLabel}>Subtotal</Text>
                  <Text style={styles.subtotalValue}>${item.subtotal.toFixed(2)}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Items Count Section */}
      {cart.length > 0 && (
        <View style={styles.itemsCountSection}>
          <Text style={styles.itemsCountLabel}>Total Items:</Text>
          <Text style={styles.itemsCountValue}>{calculateTotalItems()}</Text>
        </View>
      )}

      {/* Total Section */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
      </View>

      {/* Product Manager Modal */}
      <ProductManager
        visible={showProductManager}
        onClose={() => setShowProductManager(false)}
        onProductUpdated={handleProductUpdated}
      />
    </View>
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
  headerButtons: {
    flexDirection: 'row',
  },
  manageButton: {
    backgroundColor: '#1976D2', // Blue
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scannerSection: {
    backgroundColor: '#F5F5F5', // Light gray
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE', // Light red background
    borderWidth: 1,
    borderColor: '#D32F2F', // Red border
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#D32F2F', // Red text
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
    fontStyle: 'italic',
  },
  manualInputContainer: {
    flexDirection: 'row',
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#1976D2', // Blue
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  productsList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  productsListContent: {
    padding: 16,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartItemUnknown: {
    backgroundColor: '#FFF3E0', // Light orange background
    borderWidth: 2,
    borderColor: '#FF9800', // Orange border
    borderStyle: 'dashed', // Dashed border for extra distinction
    elevation: 3,
    shadowColor: '#FF9800',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  cartItemDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  cartItemDescriptionUnknown: {
    color: '#E65100', // Dark orange text
    fontWeight: '700',
  },
  cartItemBarcode: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  cartItemBarcodeUnknown: {
    color: '#F57C00', // Orange text
    fontWeight: '600',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  unknownProductLabel: {
    fontSize: 14,
    color: '#FF9800', // Orange color for unknown products
    fontWeight: '500',
    fontStyle: 'italic',
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    backgroundColor: '#2E7D32', // Green
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  cartItemSubtotal: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  subtotalLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  subtotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32', // Green
  },
  itemsCountSection: {
    backgroundColor: '#E8F5E9', // Light green background
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#C8E6C9',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsCountLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32', // Green text
  },
  itemsCountValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2', // Blue text
  },
  totalSection: {
    backgroundColor: '#2E7D32', // Green
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#1B5E20',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default POSScreen;

