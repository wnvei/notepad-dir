import React from 'react'

const Content = () => {
  return (
    <div className="w-full max-w-screen overflow-x-hidden px-6">
      <div className="flex flex-col items-center text-center py-12 max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl sm:text-6xl md:text-[4rem]">Content Policy</h1>
        <p className="text-lg">
          To keep Notiqo clean, collaborative, and open to all, we ask users to follow a few simple rules when using the platform.
        </p>
      </div>

      <div className="flex flex-col items-left text-left max-w-3xl mx-auto space-y-5 text-lg">
        <h2 className="text-xl font-semibold text-center">Prohibited Content</h2>
        <p>You may not use Notiqo to create, share, or store content that:</p>
        <ul className="text-[17px] list-none space-y-1">
          <li>Promotes or incites violence, harassment, or abuse</li>
          <li>Contains hate speech or discrimination based on race, gender, religion, sexual orientation, nationality, or other personal attributes</li>
          <li>Includes sexually explicit or adult material</li>
          <li>Encourages or facilitates illegal activities</li>
          <li>Promotes the sale of weapons, drugs, tobacco, or alcohol</li>
          <li>Spreads false, misleading, or harmful information</li>
          <li>Spreads false, misleading, or harmful information</li>
          <li>Contains malware, phishing links, or attempts to harm users or devices</li>
          <li>Violates intellectual property rights, including copyrighted material</li>
        </ul>
      </div>

      <div className="flex flex-col items-center text-left max-w-3xl mx-auto space-y-5 text-lg pt-10">
        <h2 className="text-xl font-semibold text-center">Public & Private Rooms</h2>
        <p>
          Public rooms are accessible by anyone with the room code. Use them for open collaboration and quick notes. Keep it respectful.
        </p>
        <p>
        Private rooms are protected by a password. Only users who enter the correct password can edit. Others can view only. Do not share sensitive or personal data, even in private rooms.
        </p>
      </div>

      <div className="flex flex-col items-center text-left max-w-3xl mx-auto space-y-5 text-lg pt-10 pb-15">
        <h2 className="text-xl font-semibold text-center">Enforcement & Changes</h2>
        <p>
        All content on Notiqo is created by users. Notiqo does not actively monitor content but reserves the right to remove material or restrict access to any room that violates this policy.
        If you encounter problematic content, simply clear the room, or start fresh with a new code.
        </p>
        <p>
        Notiqo does not store previous versions of your notes. If a room’s content is edited or deleted, it cannot be recovered.
        </p>
      </div>
    </div>
  );
};

export default Content