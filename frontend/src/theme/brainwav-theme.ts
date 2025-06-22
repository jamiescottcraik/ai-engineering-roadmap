// brAInwav Theme Configuration for Naive UI
import { GlobalThemeOverrides } from 'naive-ui'

export const brainwavTheme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1E90FF', // Electric Blue
    primaryColorHover: '#4FC3F7',
    primaryColorPressed: '#1167B1',
    primaryColorSuppl: '#FF4A00', // Orange accent
    
    successColor: '#10B981',
    warningColor: '#FF4A00', // brAInwav Orange
    errorColor: '#EF4444',
    infoColor: '#1E90FF', // Electric Blue
    
    // Fixed text colors for better contrast
    textColorBase: '#1A202C', // Dark text for light backgrounds
    textColor1: '#1A202C', // Primary dark text
    textColor2: '#4A5568', // Secondary dark text
    textColor3: '#718096', // Tertiary dark text
    
    // Light theme background colors
    bodyColor: '#FFFFFF', // White background
    cardColor: '#FFFFFF', // White cards
    modalColor: '#FFFFFF', // White modals
    popoverColor: '#FFFFFF', // White popovers
    
    borderColor: '#E2E8F0',
    dividerColor: '#E2E8F0',
    
    baseColor: '#FFFFFF'
  },
  Button: {
    textColorPrimary: '#FFFFFF',
    textColorHoverPrimary: '#FFFFFF',
    textColorPressedPrimary: '#FFFFFF',
    textColorFocusPrimary: '#FFFFFF',
    
    // Secondary button text (dark text on light backgrounds)
    textColorSecondary: '#1A202C',
    textColorHoverSecondary: '#1A202C',
    textColorPressedSecondary: '#1A202C',
    textColorFocusSecondary: '#1A202C',
    
    colorPrimary: '#1E90FF',
    colorHoverPrimary: '#4FC3F7',
    colorPressedPrimary: '#1167B1',
    colorFocusPrimary: '#1E90FF',
    
    borderPrimary: '#1E90FF',
    borderHoverPrimary: '#4FC3F7',
    borderPressedPrimary: '#1167B1',
    borderFocusPrimary: '#1E90FF'
  },
  Card: {
    color: '#FFFFFF',
    colorModal: '#FFFFFF',
    colorTarget: '#FFFFFF',
    textColor: '#1A202C',
    titleTextColor: '#1A202C',
    borderColor: '#E2E8F0',
    actionColor: '#F7FAFC'
  },
  Modal: {
    color: '#FFFFFF',
    textColor: '#1A202C',
    titleTextColor: '#1A202C',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  Progress: {
    fillColor: '#1E90FF',
    railColor: '#E2E8F0',
    textColor: '#1A202C'
  },
  Tag: {
    color: '#EDF2F7',
    textColor: '#1A202C',
    borderColor: '#E2E8F0'
  }
}
