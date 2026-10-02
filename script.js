const header=document.querySelector('.site-header');const menu=document.querySelector('.menu-btn');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>30),{passive:true});
menu?.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',open?'true':'false')});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
/* =========================================
   HOWLREX OFFICIAL CONTACT FORM
   ========================================= */

const contactForm = document.getElementById("howlrex-contact-form");
const formSuccess = document.getElementById("form-success");
const formError = document.getElementById("form-error");

if (contactForm) {

    contactForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        formSuccess.style.display = "none";
        formError.style.display = "none";

        const submitButton =
            contactForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "SENDING...";

        try {

            const response = await fetch(
                contactForm.action,
                {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (response.ok) {

                contactForm.reset();

                formSuccess.style.display = "block";

                submitButton.disabled = false;
                submitButton.textContent = "ENQUIRY SENT ✓";

            } else {

                throw new Error("Form submission failed");

            }

        } catch (error) {

            formError.style.display = "block";

            submitButton.disabled = false;
            submitButton.textContent =
                "SEND OFFICIAL ENQUIRY ↗";

        }

    });

}
