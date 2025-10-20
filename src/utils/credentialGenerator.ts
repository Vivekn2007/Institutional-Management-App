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

export const generatePassword = (length: number = 8): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
