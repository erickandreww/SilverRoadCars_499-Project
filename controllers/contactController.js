const contactView = (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    success: false,
    error: null,
    formData: {},
  });
};

const submitContact = (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.render('contact', {
      title: 'Contact Us',
      success: false,
      error: 'All fields are required.',
      formData: { name, email, subject, message },
    });
  }

  // TODO: hook up nodemailer here to send an actual email
  console.log(`Contact form submission from ${name} <${email}> — ${subject}`);

  res.render('contact', {
    title: 'Contact Us',
    success: true,
    error: null,
    formData: {},
  });
};

module.exports = { contactView, submitContact };
