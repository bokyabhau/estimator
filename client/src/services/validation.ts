interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
}

class ValidationService {
  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Indian phone number (10 digits starting with 6-9)
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Validate password strength
   */
  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  /**
   * Check if passwords match
   */
  private doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Validate registration form data
   * Returns error message if validation fails, null if valid
   */
  validateRegistrationForm(formData: RegistrationFormData): string | null {
    const { firstName, lastName, email, phoneNumber, address, password, confirmPassword } = formData;

    // Check required fields
    if (!firstName || !lastName || !email || !phoneNumber || !address || !password) {
      return 'All fields are required';
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      return 'Please enter a valid email address';
    }

    // Validate phone number format
    if (phoneNumber.length !== 10) {
      return 'Phone number must be 10 digits';
    }

    if (!this.isValidPhoneNumber(phoneNumber)) {
      return 'Phone number must start with 6-9';
    }

    // Validate password strength
    if (!this.isValidPassword(password)) {
      return 'Password must be at least 6 characters long';
    }

    // Validate password confirmation
    if (!this.doPasswordsMatch(password, confirmPassword)) {
      return 'Passwords do not match';
    }

    return null; // No errors
  }

  /**
   * Sanitize phone number input - remove non-numeric characters and limit to 10 digits
   */
  sanitizePhoneNumber(value: string): string {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.slice(0, 10);
  }
}

export default new ValidationService();
