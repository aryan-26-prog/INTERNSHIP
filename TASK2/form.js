document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // Initialize form elements with animation classes
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        // Trigger animations after a short delay
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });

    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Field validation functions
    function validateName() {
        const nameInput = document.getElementById('name');
        const errorElement = document.getElementById('name-error');
        const value = nameInput.value.trim();
        
        if (value === '') {
            showError(nameInput, errorElement, 'Name is required');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(nameInput, errorElement, 'Name should only contain letters');
            return false;
        } else {
            showSuccess(nameInput, errorElement);
            return true;
        }
    }

    function validateEmail() {
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('email-error');
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value === '') {
            showError(emailInput, errorElement, 'Email is required');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(emailInput, errorElement, 'Please enter a valid email');
            return false;
        } else {
            showSuccess(emailInput, errorElement);
            return true;
        }
    }

    function validatePhone() {
        const phoneInput = document.getElementById('phone');
        const errorElement = document.getElementById('phone-error');
        const value = phoneInput.value.trim();
        
        if (value !== '' && !/^\d{10,15}$/.test(value)) {
            showError(phoneInput, errorElement, 'Please enter a valid phone number');
            return false;
        } else {
            showSuccess(phoneInput, errorElement);
            return true;
        }
    }

    function validatePassword() {
        const errorElement = document.getElementById('password-error');
        const value = passwordInput.value;
        
        if (value === '') {
            showError(passwordInput, errorElement, 'Password is required');
            updatePasswordStrength(0);
            return false;
        } else if (value.length < 8) {
            showError(passwordInput, errorElement, 'Password must be at least 8 characters');
            updatePasswordStrength(1);
            return false;
        } else {
            showSuccess(passwordInput, errorElement);
            return true;
        }
    }

    function validateConfirmPassword() {
        const confirmPasswordInput = document.getElementById('confirm-password');
        const errorElement = document.getElementById('confirm-password-error');
        const value = confirmPasswordInput.value;
        
        if (value === '') {
            showError(confirmPasswordInput, errorElement, 'Please confirm your password');
            return false;
        } else if (value !== passwordInput.value) {
            showError(confirmPasswordInput, errorElement, 'Passwords do not match');
            return false;
        } else {
            showSuccess(confirmPasswordInput, errorElement);
            return true;
        }
    }

    function updatePasswordStrength(strength) {
        const strengthContainer = document.querySelector('.password-strength-container');
        const strengthRating = document.querySelector('.strength-rating');
        const requirements = document.querySelectorAll('.password-requirements li');
        
        // Reset all classes
        strengthContainer.className = 'password-strength-container';
        
        // Check password requirements
        const hasMinLength = passwordInput.value.length >= 8;
        const hasUppercase = /[A-Z]/.test(passwordInput.value);
        const hasNumber = /\d/.test(passwordInput.value);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordInput.value);
        
        // Update requirement indicators
        requirements[0].classList.toggle('valid', hasMinLength);
        requirements[1].classList.toggle('valid', hasUppercase);
        requirements[2].classList.toggle('valid', hasNumber);
        requirements[3].classList.toggle('valid', hasSpecialChar);
        
        // Determine strength level
        let strengthLevel = 'weak';
        let ratingText = 'Weak';
        
        if (strength >= 4) {
            strengthLevel = 'strong';
            ratingText = 'Strong';
            strengthContainer.classList.add('strength-strong');
        } else if (strength >= 3) {
            strengthLevel = 'good';
            ratingText = 'Good';
            strengthContainer.classList.add('strength-good');
        } else if (strength >= 2) {
            strengthLevel = 'fair';
            ratingText = 'Fair';
            strengthContainer.classList.add('strength-fair');
        } else if (strength >= 1) {
            strengthContainer.classList.add('strength-weak');
        }
        
        strengthRating.textContent = ratingText;
    }

    function checkPasswordStrength(password) {
        if (password.length === 0) return 0;
        
        let strength = 0;
        
        // Length contributes to strength
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return Math.min(strength, 4);
    }

    function showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Add shake animation
        input.style.animation = 'none';
        void input.offsetWidth; // Trigger reflow
        input.style.animation = 'shake 0.5s';
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.classList.remove('show');
    }

    // Real-time password strength evaluation
    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        updatePasswordStrength(strength);
        validatePassword();
    });

    // Event listeners for validation
    document.getElementById('name').addEventListener('blur', validateName);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('phone').addEventListener('blur', validatePhone);
    document.getElementById('confirm-password').addEventListener('blur', validateConfirmPassword);

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
            // Simulate API call with timeout
            setTimeout(() => {
                // Hide form and show success message
                form.style.opacity = '0';
                form.style.pointerEvents = 'none';
                
                // Show success message with animation
                successMessage.classList.add('show');
                successMessage.classList.add('animate__fadeIn');
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    
                    // Remove success classes from inputs
                    document.querySelectorAll('input').forEach(input => {
                        input.classList.remove('success');
                    });
                    
                    // Reset password strength
                    updatePasswordStrength(0);
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        successMessage.classList.remove('animate__fadeIn');
                        form.style.opacity = '1';
                        form.style.pointerEvents = 'all';
                        submitBtn.classList.remove('loading');
                    }, 5000);
                }, 500);
            }, 1500);
        } else {
            // If validation fails, remove loading state
            setTimeout(() => {
                submitBtn.classList.remove('loading');
            }, 500);
            
            // Scroll to first error
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    });
});