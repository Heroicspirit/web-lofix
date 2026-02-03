(async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@gmail.com', password: '123456' })
    });
    const loginJson = await loginRes.json();
    console.log('LOGIN_RESPONSE', JSON.stringify(loginJson));

    const token = loginJson.token || loginJson.data?.token || loginJson.data?.accessToken;
    if (!token) {
      console.error('No token in login response');
      process.exit(2);
    }

    const form = new FormData();
    form.append('name', 'Created By Bot');
    form.append('email', 'created_user_by_bot@example.com');
    form.append('password', 'Password123!');
    form.append('confirmPassword', 'Password123!');

    const createRes = await fetch('http://localhost:5000/api/admin/users/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });
    const createJson = await createRes.json();
    console.log('CREATE_RESPONSE', JSON.stringify(createJson));
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
