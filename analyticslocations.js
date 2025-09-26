(async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const loc = await res.json();

    const ip = encodeURIComponent(loc.ip);
    const country = encodeURIComponent(loc.country_name);
    const city = encodeURIComponent(loc.city);

    const webAppUrl = 'https://script.google.com/macros/s/AKfycbzZ7cBTyOpsRdaQDUoCsQofrS6ZdBMow12UeK6AojH0_J8v1DKJjdpL5LpKxAKAxtrJ1g/exec';
    const url = `${webAppUrl}?ip=${ip}&country=${country}&city=${city}`;

    // Send GET request to log visitor
    await fetch(url);

  } catch (err) {
    console.error('Error logging visitor location:', err);
  }
})();