# Lessons Learned - Next.js with MariaDB Project

This document captures key insights and solutions discovered during the development of our Next.js application connecting to a MariaDB database.

## Database Connection Challenges

### Special Characters in Database Passwords

**Challenge**: When using environment variables to store database passwords with special characters (like `$`, `*`), the connection often fails. Special characters in `.env.local` files can cause issues as they may be interpreted differently by the system.

**Solution**: Base64 encode the password in the environment file:

```
# Instead of 
DB_PASSWORD=P@ssw0rd$pecial*Ch@rs!

# Use encoded version
DB_PASSWORD_BASE64=UEBzc3cwcmQkcGVjaWFsKkNoQHJzIQ==
```

Then decode it at runtime:

```typescript
function getPassword() {
  const base64Password = process.env.DB_PASSWORD_BASE64;
  if (!base64Password) return '';
  
  try {
    return Buffer.from(base64Password, 'base64').toString();
  } catch (err) {
    console.error('Error decoding password:', err);
    return '';
  }
}
```

This approach:
- Prevents issues with special characters in environment variables
- Keeps sensitive credentials out of committed code
- Works consistently across development environments
- Follows security best practices

### Connection Pooling in Serverless Environments

**Challenge**: Traditional connection pooling doesn't work well in serverless environments like Next.js API routes. This can cause timeouts and hanging connections.

**Solution**: Use direct connections instead of pools for serverless functions:

```typescript
export async function directQuery(sql: string, params: any[] = []) {
  let conn;
  try {
    // Create new connection for each request
    conn = await mariadb.createConnection({
      // connection parameters
      connectTimeout: 5000, // Short timeout for serverless
      socketTimeout: 5000,
    });
    
    // Execute with timeout safety
    const rows = await Promise.race([
      conn.query(sql, params),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 4000)
      )
    ]);
    
    return rows;
  } finally {
    // Always close connection
    if (conn) await conn.end();
  }
}
```

Key practices:
- Create a fresh connection for each request
- Always close connections in a finally block
- Use short timeouts to prevent hanging
- Implement timeout safety with Promise.race()

## Next.js Environment Variables

### Environment Variable Handling

**Challenge**: Next.js has specific ways of handling environment variables, and accessing them in API routes requires understanding their limitations.

**Key Learnings**:
- Environment variables in `.env.local` are loaded automatically by Next.js
- They need to be properly handled when they contain special characters
- Environment variables are string values and may need conversion (e.g., `parseInt`)
- For client components, prefix variables with `NEXT_PUBLIC_`

### Debugging Environment Variables

When environment variables don't work as expected, create debugging endpoints:

```typescript
export async function GET() {
  return NextResponse.json({
    environment: {
      DB_HOST: Boolean(process.env.DB_HOST),
      DB_USER: Boolean(process.env.DB_USER),
      DB_PASSWORD_BASE64: Boolean(process.env.DB_PASSWORD_BASE64),
      DB_PASSWORD_BASE64_LENGTH: process.env.DB_PASSWORD_BASE64?.length || 0,
    }
  });
}
```

This allows checking if variables are properly loaded without exposing sensitive data.

## Next.js API Routes Best Practices

### Error Handling

Always implement proper error handling in API routes:

```typescript
try {
  // Database operations
  return NextResponse.json({ 
    status: 'success', 
    data: result 
  });
} catch (error: any) {
  console.error('API error:', error);
  return NextResponse.json(
    { 
      status: 'error', 
      message: 'Operation failed', 
      error: error.message
    },
    { status: 500 }
  );
}
```

### Resource Management

In database operations, always release resources regardless of success or failure:

```typescript
let conn;
try {
  // Use connection
} catch (error) {
  // Handle error
} finally {
  if (conn) {
    try {
      await conn.end();
    } catch (e) {
      console.error('Error closing connection:', e);
    }
  }
}
```

## React Client Components

### Dynamic API Endpoint Selection

We implemented a pattern to dynamically switch between API endpoints:

```typescript
// Function to fetch data from selected endpoint
const fetchData = async (apiEndpoint: string) => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch(apiEndpoint);
    // Process response
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setLoading(false);
  }
};

// Handler for changing endpoints
const handleEndpointChange = (newEndpoint: string) => {
  setEndpoint(newEndpoint);
  fetchData(newEndpoint);
};
```

This pattern allows users to test different connection methods and see which works best.

## Security Considerations

### Securing Credentials

- **Never** hardcode database credentials in your code
- Store sensitive information in environment variables
- Consider encoding sensitive values with special characters
- Don't expose credentials in error messages or logs
- Be careful about what you include in API responses

### Connection Security

- Use appropriate timeouts to prevent hanging connections
- Close database connections properly even when errors occur
- Consider using connection limits appropriate for your environment
- Log connection events without exposing sensitive information

## Conclusion

Building a Next.js application with database connectivity requires careful consideration of the serverless environment, proper handling of environment variables, and sound security practices. The approaches documented here provide patterns for reliable database connections while maintaining good security practices. 