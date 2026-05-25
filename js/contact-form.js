/* ─────────────────────────────────────────────────────
   Nautilus Code — contact-form.js
   Requires: EmailJS CDN loaded before this script
   Usage: <script src="js/contact-form.js"></script>
───────────────────────────────────────────────────── */

(function () {

  /* ── CONFIG — replace these 3 values ── */
  const EMAILJS_PUBLIC_KEY  = 'F3xYHoO8AW9tr55px';
  const EMAILJS_SERVICE_ID  = 'service_ip7ozhb';
  const EMAILJS_TEMPLATE_ID = 'template_dtdqdkr';
  const WHATSAPP_NUMBER     = '94713441221';
  /* ────────────────────────────────────── */

  emailjs.init(EMAILJS_PUBLIC_KEY);


  /* ── Progress bar ── */
  function updateProgress(step) {
    var pct = Math.round((step / 3) * 100);
    document.getElementById('stepLabel').textContent   = 'Step ' + step + ' of 3';
    document.getElementById('stepPercent').textContent = pct + '%';
    document.getElementById('progressBar').style.width = pct + '%';
  }


  /* ── Step navigation ── */
  window.nextStep = function (current) {
    if (current === 1) {
      var name  = document.getElementById('f_name').value.trim();
      var phone = document.getElementById('f_phone').value.trim();
      if (!name || !phone) {
        alert('Please enter your name and phone number.');
        return;
      }
    }

    if (current === 2) {
      var selected = document.querySelectorAll('.service-select-btn.selected');
      if (selected.length === 0) {
        alert('Please select at least one service.');
        return;
      }
      var labels = Array.from(selected).map(function (b) {
        return b.querySelector('span').textContent;
      });
      document.getElementById('selectedList').textContent = labels.join(', ');
      document.getElementById('selectedSummary').style.display = 'block';
    }

    document.getElementById('step' + current).style.display = 'none';
    document.getElementById('step' + (current + 1)).style.display = 'block';
    updateProgress(current + 1);
  };


  window.prevStep = function (current) {
    document.getElementById('step' + current).style.display = 'none';
    document.getElementById('step' + (current - 1)).style.display = 'block';
    updateProgress(current - 1);
  };


  /* ── Service button toggle ── */
  window.toggleService = function (btn) {
    btn.classList.toggle('selected');
    if (btn.classList.contains('selected')) {
      btn.style.borderColor = 'var(--electric)';
      btn.style.background  = 'var(--electric-pale)';
    } else {
      btn.style.borderColor = '';
      btn.style.background  = '';
    }
  };


  /* ── Submit ── */
  window.submitInquiry = function () {
    var name     = document.getElementById('f_name').value.trim();
    var phone    = document.getElementById('f_phone').value.trim();
    var email    = document.getElementById('f_email').value.trim();
    var brief    = document.getElementById('f_brief').value.trim();
    var nda      = document.getElementById('nda').checked;
    var selected = Array.from(document.querySelectorAll('.service-select-btn.selected'))
                        .map(function (b) { return b.querySelector('span').textContent; })
                        .join(', ');

    if (!brief) {
      alert('Please describe what you need — even 1 sentence is fine.');
      return;
    }

    var submitBtn = document.querySelector('#step3 .btn-primary');
    submitBtn.disabled     = true;
    submitBtn.textContent  = 'Sending...';

    var templateParams = {
      from_name  : name,
      phone      : phone,
      from_email : email   || 'Not provided',
      services   : selected || 'Not selected',
      brief      : brief,
      nda        : nda ? 'Yes — please send NDA' : 'No'
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {

        // Show success state
        document.getElementById('step3').style.display        = 'none';
        document.getElementById('contactSuccess').style.display = 'block';

        // Also fire WhatsApp message
        var msg = '*New Inquiry — Nautilus Code*'
          + '\n\n*Name:* '     + name
          + '\n*Phone:* '      + phone
          + '\n*Email:* '      + (email || 'N/A')
          + '\n*Services:* '   + (selected || 'N/A')
          + '\n*Brief:* '      + brief
          + '\n*NDA:* '        + (nda ? 'Yes' : 'No');

        setTimeout(function () {
          window.open(
            'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg),
            '_blank'
          );
        }, 900);

      })
      .catch(function (error) {
        console.error('EmailJS error:', error);
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Inquiry →';
        alert('Could not send the email. Please WhatsApp us directly at +' + WHATSAPP_NUMBER);
      });
  };

})();