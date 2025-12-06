import { jwt, sign, verify, decode } from 'hono/jwt';

const test = async () => {
  //   const payload = {
  //     sub: 'user123',
  //     role: 'admin',
  //     exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  //   };
  //   const token = await sign(payload, 'potato');

  //   console.log(token);

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVXVpZCI6Ijk5YzQ4MmNmLTA5NWItNGJhMS1iOTUyLTNkZDVjZDE2MTMyMiIsImVtYWlsIjoiY29vbDIyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiU3RldmUyMiIsImZpcnN0TmFtZSI6IlN0ZXZlbiIsImxhc3ROYW1lIjoiU3RldmVuc29uIiwiZXhwIjoxNzY3NTk0Nzc1fQ.PFQLrOYYoO8NCqOtNU5t_ZXywzuHSbCEPp1fn1Q1kk8';

  // Decode JWT payload using hono/jwt decode
  // Yes, you can decode a JWT without a secret because decode() only base64-decodes the payload, not verify the signature.
  const verified = await verify(token, 'change_me_later_please'); // This just decodes; it doesn't validate integrity.

  /*
    - I create a JWT
    - I send it back to the client
    - Client sends it to me
    - How do I make sure that it hasn't been tampered with?
    */

  console.log(verified);
};

test();
