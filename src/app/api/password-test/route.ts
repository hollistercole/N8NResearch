import { NextResponse } from 'next/server';

/**
 * Decodes the Base64 encoded password from environment variables
 * This is a secure way to handle special characters in passwords
 */
function getPassword(): string {
  // Use the BASE64 encoded password from environment variables
  const base64Password = process.env.DB_PASSWORD_BASE64 || process.env.DB_PASSWORD || '';
  
  if (!base64Password) {
    console.error('DB_PASSWORD environment variable is missing');
    return '';
  }
  
  try {
    // Decode the BASE64 encoded password
    return Buffer.from(base64Password, 'base64').toString();
  } catch (err) {
    console.error('Error decoding password:', err);
    return ''; // Return empty string on error
  }
}

export async function GET() {
  try {
    // Get environment variables
    const dbHost = process.env.DB_HOST || '54.176.154.219';
    const dbPort = parseInt(process.env.DB_PORT || '3306');
    const dbUser = process.env.DB_USER || 'demo_user';
    const dbName = process.env.DB_NAME || 'demo_database';
    
    // Get the decoded password
    const decodedPassword = getPassword();
    
    // Mask the password for security (show first character and length)
    const maskedPassword = decodedPassword 
      ? `${decodedPassword.charAt(0)}${'*'.repeat(Math.max(0, decodedPassword.length - 2))}${decodedPassword.charAt(decodedPassword.length - 1)} (length: ${decodedPassword.length})`
      : '<empty>';
    
    return NextResponse.json({
      success: true,
      message: 'Password decoded successfully',
      connection: {
        host: dbHost,
        port: dbPort,
        user: dbUser,
        database: dbName,
        password: maskedPassword,
        passwordBase64: process.env.DB_PASSWORD_BASE64 ? '(set)' : '(not set)',
        passwordPlain: process.env.DB_PASSWORD ? '(set)' : '(not set)'
      }
    });
  } catch (error) {
    console.error('Password test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 