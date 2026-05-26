import React from 'react'

const FirstLayer = () => {
  return (
    <section className="w-full min-h-screen mt-0">
        <article className="relative w-fit min-h-5xl m-auto px-10 py-20">
        <div className="all relative flex flex-wrap justify-center">
        <div className="relative mt-10 w-full  border-b-2  mb-8 border-slate-600 max-w-[400px] min-w-[300px] mx-auto ">
        <h4 className='-top-3 bg-white left-[calc(50%-75px)] z-20 absolute text-center min-w-[150px] text-orange-500 font-bold'>🍪 Cookies Policy 🍪</h4>
        </div>
       <p className="text-center mt-20 mb-10 font-serif m-auto">
       <strong> 1. What Are Cookies?</strong><br />
Cookies are small text files stored on your device when you visit our website. They help us improve your experience by remembering your preferences, analyzing site traffic, and delivering relevant content or ads. <br /><br />

<strong>2. How We Use Cookies</strong><br />
We use cookies to: <br />

Recognize returning visitors <br />

Store user preferences (e.g., language or theme) <br />

Track website usage via analytics tools (e.g., Google Analytics) <br />

Enable features such as login sessions or comments <br />

Serve targeted content or advertisements <br />
</p>
<table className='w-fit m-auto min-h-fit max-w-3xl p-4'>
    <tr className='p-2'>
        <th>Type</th>
        <th>Purpose</th>
    </tr>
    <tr className='p-2'>
        <td className='p-2'>Essential Cookies</td>
        <td className='p-2'>Required for basic site functions and navigation</td>
    </tr>
    <tr className='p-2'>
        <td className='p-2'>Performance Cookies</td>
        <td className='p-2'>Track site usage and help improve functionality</td>
    </tr>
    <tr className='p-2'>
        <td className='p-2'>Functionality Cookies</td>
        <td className='p-2'>Store your settings and preferences (e.g., username, language)</td>
    </tr>
    <tr className='p-2'>
        <td className='p-2'>Advertising Cookies</td>
        <td className='p-2'>Deliver ads relevant to your interests (may be placed by third parties)</td>
    </tr>
</table>
<p className='text-center mt-20 font-serif m-auto'>
<strong>4. Third-Party Cookies</strong><br />
We may use third-party services such as: <br />

Google Analytics <br />

YouTube (embedded content) <br />

Social Media Widgets (e.g., Facebook, Twitter) <br />

These third parties may use cookies to track your activity across different websites. <br /> <br />

<strong>5. How to Control Cookies</strong><br />
You have full control over cookies and can: <br />

Accept or reject non-essential cookies using our cookie banner (if implemented) <br />

Delete or disable cookies via your browser settings <br />

Note: Disabling cookies may impact the performance or functionality of certain website features. <br />

Browser Guides: <br />
Chrome <br />
Firefox <br />
Safari <br />
Edge <br /><br />
<strong>6. Consent</strong><br />
By continuing to browse our website, you consent to our use of cookies in accordance with this policy. You may withdraw your consent at any time by updating your browser settings or cookie preferences. <br /><br />

<strong>7. Updates to This Policy</strong><br />
We may update this Cookie Policy from time to time. All changes will be posted on this page with the revised Effective Date.

        </p>
       </div>
        </article>
     </section>
  )
}

export default FirstLayer
