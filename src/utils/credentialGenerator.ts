// Utility functions for generating credentials

export const generateProfessorId = (instituteName: string, professorName: string): string => {
  const instituteCode = instituteName.substring(0, 3).toUpperCase();
  const nameCode = professorName.split(' ').map(n => n[0]).join('').toUpperCase();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${instituteCode}P${nameCode}${random}`;
};

export const generateStudentRollNumber = (
  instituteName: string, 
  branchCode: string, 
  admissionYear: number
): string => {
  const instituteCode = instituteName.substring(0, 3).toUpperCase();
  const yearCode = admissionYear.toString().slice(-2);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${instituteCode}${yearCode}${branchCode}${random}`;
};

// Cryptographically secure random number generator
const getSecureRandomInt = (max: number): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
};

export const generatePassword = (length: number = 8): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  // Ensure at least one character from each category
  password += uppercase[getSecureRandomInt(uppercase.length)];
  password += lowercase[getSecureRandomInt(lowercase.length)];
  password += numbers[getSecureRandomInt(numbers.length)];
  password += symbols[getSecureRandomInt(symbols.length)];
  
  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[getSecureRandomInt(allChars.length)];
  }
  
  // Shuffle the password using secure random
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  
  return passwordArray.join('');
};
